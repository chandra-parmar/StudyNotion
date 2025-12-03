const instance = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const courseEnrollmentEmail = require('../mail/templates/courseEnrollmentEmail'); 
require('dotenv').config();
const mongoose = require("mongoose");
const crypto = require('crypto');


// -------------------------------------------------------------
// CREATE ORDER
// -------------------------------------------------------------
const capturePayment = async (req, res) => {
    try {
        const { courses } = req.body;
        const userId = req.user.id;

        if (!courses || courses.length === 0) {
            return res.status(400).json({ success: false, message: "No courses provided" });
        }

        let totalAmount = 0;

        for (const courseId of courses) {
            const id = courseId._id || courseId;

            const course = await Course.findById(id);
            if (!course) {
                return res.status(400).json({ success: false, message: "Course not found" });
            }

            if (course.studentsEnrolled.includes(userId)) {
                return res.status(400).json({
                    success: false,
                    message: `Already enrolled in ${course.courseName}`
                });
            }

            totalAmount += course.price;
        }

        const options = {
            amount: totalAmount * 100,
            currency: "INR",
            receipt: `rcpt_${Date.now()}`
        };

        const order = await instance.orders.create(options);

        return res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        console.log("capturePayment error:", error);
        return res.status(500).json({ success: false, message: "Failed to create order" });
    }
};


// -------------------------------------------------------------
// VERIFY PAYMENT SIGNATURE
// -------------------------------------------------------------
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courses } = req.body;
        const userId = req.user.id;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses) {
            return res.status(400).json({
                success: false,
                message: "Payment details missing"
            });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        await enrollStudents(courses, userId);

        return res.status(200).json({
            success: true,
            message: "Payment verified & enrollment successful"
        });

    } catch (error) {
        console.log("verifyPayment error:", error);
        return res.status(500).json({ success: false, message: "Payment verification failed" });
    }
};


// -------------------------------------------------------------
// ENROLL STUDENT AFTER PAYMENT
// -------------------------------------------------------------
const enrollStudents = async (courses, userId) => {
    for (const courseId of courses) {
        const id = courseId._id || courseId;

        const course = await Course.findByIdAndUpdate(
            id,
            { $push: { studentsEnrolled: userId } },
            { new: true }
        );

        if (!course) continue;

        const student = await User.findByIdAndUpdate(
            userId,
            { $push: { courses: id } },
            { new: true }
        );

        await mailSender(
            student.email,
            `Successfully enrolled into ${course.courseName}`,
            courseEnrollmentEmail(student.firstName, course.courseName)
        );

        console.log("Enrollment email sent");
    }
};


// -------------------------------------------------------------
// SEND PAYMENT SUCCESS EMAIL (Frontend triggers this)
// -------------------------------------------------------------
const sendPaymentSuccessEmailController = async (req, res) => {
    try {
        const { orderId, paymentId, amount } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);

        await mailSender(
            user.email,
            `Payment Successful`,
            courseEnrollmentEmail(user.firstName, `₹${amount / 100}`, orderId, paymentId)
        );

        return res.status(200).json({
            success: true,
            message: "Payment success email sent"
        });

    } catch (error) {
        console.log("Error sending payment success email:", error);
        return res.status(500).json({ success: false, message: "Email send failed" });
    }
};


module.exports = {
    capturePayment,
    verifyPayment,
    sendPaymentSuccessEmailController,
    enrollStudents
};
