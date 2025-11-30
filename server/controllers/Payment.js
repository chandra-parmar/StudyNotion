const instance  = require('../config/razorpay')
const Course = require('../models/Course')
const User= require('../models/User')
const mailSender = require('../utils/mailSender')
const {courseEnrollmentEmail} = require('../mail/templates/courseEnrollmentEmail')
require('dotenv').config()
const mongoose = require("mongoose");
const crypto = require('crypto')



const capturePayment = async(req,res)=>{
     let totalAmount =0
      try{

        //1 get userid and course id 
        const {courses} = req.body
        const userId = req.user.id 

        if(courses.length ===0)
        {
            return res.json({
                success:false,
                message:"please provide course id"
            })


        }

        //calcultate total amount
       // let totalAmount =0

        for (const course_id of courses) {

    const id = course_id._id || course_id;

    let course = await Course.findById(id);
    if (!course) {
        return res.status(200).json({
            success: false,
            message: "Could not find the course"
        });
    }

    const uid = new mongoose.Types.ObjectId(userId);

    if (course.studentsEnrolled.includes(uid)) {
        return res.status(200).json({
            success: false,
            message: "Student already enrolled"
        });
    }

    totalAmount += course.price;
}


      }catch(error)
      {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message
        })
      }

      //create options

      const options ={
        amount: totalAmount*100,
        currency:"INR",
        receipt:Math.random(Date.now()).toString()

      }

      //create order
      try{
          const paymentResponse = await instance.orders.create(options)
          res.status(200).json(
            {
                success:true,
                order:paymentResponse
            }
          )
      }catch(error)
      {
        console.log(error)
        return res.status(500).json(
            {
                success:false,
                message:error.message
            }
        )
      }

}


// verify signature/ payment
const verifyPayment = async(req,res)=>{
    
    const razorpay_order_id = req.body?.razorpay_order_id
    const razorpay_payment_id= req.body?.razorpay_payment_id
    const razorpay_signature = req.body?.razorpay_signature
    const courses= req.body?.courses
    const userId = req.user.id


    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature ||!courses ||!userId)
    {
        return res.status(200).json(
            {
                success:false,
                message:"payment failed"
            }
        )
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto.createHmac("sha256",process.env.RAZORPAY_SECRET)
                                 .update(body.toString())
                                 .digest("hex")

          if(expectedSignature === razorpay_signature) 
            {
                //enroll student
                await enrollStudents(courses,userId,res)

                //return res
                return res.status(200).json(
                    {
                        success:true,
                        message:"payment verified"
                    }
                )
            } 
            return res.status(200).json(
                {
                    success:"false",
                    message:"payment failed"
                }
            )                     
}

const enrollStudents = async(courses,userId,res)=>
{
        if(!courses ||!userId)
        {
            return res.status(400).json(
                {
                    success:false,
                    message:"please provide data for courses or user"
                }
            )
        } 

        //if mutliple course then insert userid in courses
        for(const courseId of courses)
        {
            try{
                const enrolledCourse = await Course.findOneAndUpdate(
                  {_id:courseId},
                  {$push:{studentsEnrolled:userId}},
                  {new:true} 
            )

            if(!enrolledCourse)
            {
                return res.status(500).json(
                    {
                        success:false,
                        message:"course not found"
                    }
                )
            }
            //find the student and add the course to their list of enrolledcourses
            const enrolledStudent = await User.findByIdAndUpdate(userId,
                {$push:{
                    courses:courseId,

                }},{new:true} 
            )

            //sending mail to enrolled student 
            const emailResponse = await mailSender(
                enrollStudent.email,
                `successfully enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName,`${enrolledStudent.firstName}`)
            )

            console.log("email sent successfully")

            }catch(error)
            {
               console.log(error)
               return res.status(500).json(
                {
                    success:false,
                    message:error.message
                }
               )
            }

        }
}

const sendPaymentSuccessEmail = async(req,res)=>{

    const {orderId,paymentId,amount } = req.body

    const userId = req.user.id

    // if(!orderId || !paymentId ||!amount || !userId)
    // {
    //      return res.status(400).json(
    //         {
    //             success:false,
    //             message:"please provide all the fields"
    //         }
    //      ) 
    // }

    try{

        //find student 
        const enrolledStudent = await User.findById(userId)
        await mailSender(
            enrolledStudent.email,
            `payment recieved`,
            sendPaymentSuccessEmail(`${enrolledStudent.firstName}`,
            amount*100, orderId,paymentId )
        )

    }catch(error)
    {
         console.log('error in sending mail',error)
         return res.status(500).json(
            {
                success:false,
                message:"Could not send email"
            }
         )
    }
}






















module.exports ={
    capturePayment,
    verifyPayment,
    enrollStudents,
    sendPaymentSuccessEmail
}