const {instance } = require('../config/razorpay')
const Course = require('../models/Course')
const User= require('../models/User')
const mailSender = require('../utils/mailSender')
const {courseEnrollmentEmail} = require('../mail/templates/courseEnrollmentEmail')
require('dotenv').config()

//capture payment 
const capturePayment = async(req,res)=>{
    try{
      //get courseid and userid
      const {course_id} = req.body
      const userId = req.user.id

      //validation

      //valid courseid
      if(!course_id)
      {
        return res.json(
            {
                success:false,
                message:"please provide valid course id"
            }
        )
      }
      //valid coursedetail
      let course
      try{
          course = await Course.find(course_id)

          if(!course)
          {
            return res.json(
                {
                    success:false,
                    message:"could not find the course"
                }
            )
          }
          
          //check user already pay or not
                    
                     //converting user stringid  into object id
                    
          const uid= new mongoose.Types.ObjectId(userId)

          if(course.studentsEnrolled.includes(uid))
          {
            return res.status(200).json(
                {
                    success:false,
                    message:"user is already enrolled"
                }
            )
          }

      }catch(error)
      {
       console.error(error)
       return res.status(500).json(
        {
            success:false,
            message:error.message
        }
       )
      }
    
      //order create
      const amount = course.price
      const currency= 'INR'

      const options = {
        amount:amount*100,
        currency,
        receipt:Math.random(Date.now()).toString(),
        notes:{
            courseId:course_id,
            userId
        }
      }
      
      try{
        //initiate the payment using razorpay
       const paymentResponse =  await instance.orders.create(options)
       console.log(paymentResponse)

       //return response
       return res.status(200).json(
        {
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount
        }
       )

      }catch(error)
      {
        console.log(error)
        res.json(
            {
                success:false,
                message:"Could not initate order"
            }
        )
      }
    }catch(error)
    {
       console.log(error)
       return res.status(500).json(
        {
            success:false,
            message:"Could not capture payment"
        }
       )
    }
}

// authorized payment
//verify signature of razorpay and server
const verifySignature = async(req,res)=>{
    
        const webhookSecret= process.env.webhookSecret
        
        //from signature
        const signature = req.headers['x-razorpay-signature']

        const shasum = crypto.createHmac('sha256',webhookSecret)
        shasum.update(JSON.stringify(req.body))

        //convert webhook into digest
       const digest = shasum.digest('hex')

       //match signature and digest
       if(signature === digest)
       {
        console.log("Payment is authorized")

         //action
         const {courseId,userId } = req.body.payload.payment.entity.notes

         try{
             
            //enroll student in course 
            const enrolledCourse = await Course.findByIdAndUpdate(
                                              {_id:courseId},
                                              {$push:{studentEnrolled:userId}},
                                              {new:true}
            )
            if(!enrolledCourse)
            {
                return res.status(500).json(
                    {
                        success:false,
                        message:"Course not found"
                    }
                )
            }

            console.log(enrolledCourse)

            //find student add the course to their list of enrolled
              const enrolledStudent = await User.findOneAndUpdate({_id:courseId},
                                                                {$push:{courses:courseId}},
                                                                {new:true}
              )
              console.log(enrolledStudent)

              //confirmation email send
              const emailResponse = await mailSender(email,enrolledStudent.email, 
                                                     "congratualtions from studynotion ",
                                                     "congratulations, you are onboarded into new Studynotion Course"
              )
              console.log(emailResponse)

              return res.status(200).json(
                {
                    success:true,
                    message:"Signature verified and course added"
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

       else
       {
        return res.status(400).json(
            {
                success:false,
                message:"signature verification failed"
            }
        )
       }

   
}

module.exports ={
    capturePayment,
    verifySignature
}