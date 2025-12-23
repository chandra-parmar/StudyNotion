const  instance  = require("../config/razorpay");
const Course = require("../models/Course");
const crypto = require("crypto");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const mongoose = require("mongoose");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail"); // Fixed incomplete import
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const CourseProgress = require("../models/CourseProgress");

// Capture the payment and initiate the Razorpay order
const capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  // Validate input
  if (!courses || !Array.isArray(courses) || courses.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide at least one valid Course ID",
    });
  }

  let total_amount = 0;

  for (const course_id of courses) {
    try {
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(course_id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid course ID format: ${course_id}`,
        });
      }

      // Find the course
      const course = await Course.findById(course_id);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: `Course not found with ID: ${course_id}`,
        });
      }

      // Check if user is already enrolled
      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(200).json({
          success: false,
          message: `You are already enrolled in "${course.courseName}"`,
        });
      }

      // Validate price
      if (typeof course.price !== "number" || course.price < 0) {
        return res.status(500).json({
          success: false,
          message: `Invalid or missing price for course: ${course.courseName}`,
        });
      }

      total_amount += course.price;
    } catch (error) {
      console.error("Error processing course:", course_id, error);
      return res.status(500).json({
        success: false,
        message: "Error validating courses",
      });
    }
  }

  // Final check: total amount must be greater than 0
  if (total_amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Total amount is zero. Cannot create payment order.",
    });
  }

  // Generate a proper unique receipt
  const receipt = `receipt_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

  const options = {
    amount: Math.round(total_amount * 100), // Convert to paise and round to avoid float issues
    currency: "INR",
    receipt,
    notes: {
      userId,
      courseIds: courses.join(","),
    },
  };

  try {
    console.log("Attempting to create Razorpay order:", options);

    const paymentResponse = await instance.orders.create(options);

    console.log("Razorpay order created:", paymentResponse.id);

    return res.status(200).json({
      success: true,
     order: {
      id: paymentResponse.id,
      amount: paymentResponse.amount,
      currency: paymentResponse.currency,
      receipt: paymentResponse.receipt,
    },
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Razorpay order creation failed:");
    console.error("Error:", error);
    console.error("Error description:", error.error?.description || error.message);

    const errorMessage =
      error.error?.description ||
      error.message ||
      "Failed to initiate payment order. Please try again.";

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

// Verify the payment signature
const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courses } = req.body;

  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(400).json({ success: false, message: "Missing payment details" });
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // Payment verified, enroll student
    await enrollStudents(courses, userId, res);
    return res.status(200).json({ success: true, message: "Payment verified successfully" });
  }

  return res.status(400).json({ success: false, message: "Invalid payment signature" });
};

// Enroll students in purchased courses
// Enroll students in purchased courses
const enrollStudents = async (courses, userId, res) => {
  // Validate inputs
  if (!courses || !userId || !Array.isArray(courses) || courses.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Missing courses or user ID",
    });
  }

  // Convert userId to ObjectId once
  let userObjectId;
  try {
    userObjectId = new mongoose.Types.ObjectId(userId);
  } catch (error) {
    console.error("Invalid user ID format:", userId);
    return res.status(400).json({
      success: false,
      message: "Invalid user ID",
    });
  }

  for (const courseIdStr of courses) {
    try {
      // ... [all the existing code inside the loop remains unchanged] ...

      console.log(`Enrolled user ${userId} in course ${courseIdStr}`);

    } catch (error) {
      console.error("Error enrolling in course:", courseIdStr, error);
      return res.status(500).json({
        success: false,
        message: `Failed to enroll in course ID: ${courseIdStr}. ${error.message}`,
      });
    }
  }

  // ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
  // ADD THE SUCCESS RESPONSE HERE
  // ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
  return res.status(200).json({
    success: true,
    message: "Payment verified and enrollment completed successfully",
  });
  // ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
};

// Send payment success email
const sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide order ID, payment ID, amount, and user ID",
    });
  }

  try {
    const student = await User.findById(userId);

    if (!student) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await mailSender(
      student.email,
      "Payment Successful - StudyNotion",
      paymentSuccessEmail(
        `${student.firstName} ${student.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );

    return res.status(200).json({
      success: true,
      message: "Payment success email sent",
    });
  } catch (error) {
    console.error("Error sending payment success email:", error);
    return res.status(500).json({
      success: false,
      message: "Could not send payment success email",
    });
  }
};

// Export all functions
module.exports = {
  capturePayment,
  verifyPayment,
  sendPaymentSuccessEmail,
  // enrollStudents is internal, no need to export unless used elsewhere
};