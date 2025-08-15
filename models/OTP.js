const mongoose = require('mongoose')
const mailSender = require('../utils/mailSender')
const emailTemplate = require('../mail/templates/emailVerificationTemplate')
const otpSchema = new mongoose.Schema(
    {
      email:{
        type:String,
        required:true
      },
      otp:{
        type:String,
        required:true
      },
      createdAt:{
           type:Date,
           default:Date.now,
           expires:60*20
      }
    }
)

//to send emails
async function sendVerificationEmail(email,otp)
{
    try{
        const mailResponse = await mailSender(email,"verfication email from studynotion",
          emailTemplate(otp))
        console.log("email send successfully",mailResponse)
    }catch(error)
    {
        console.log("error occured while sending email",error)
        throw error
    }
}

//pre middleware before document save
otpSchema.pre('save',async function(next){
  console.log("New document saved to database")

  //send email when a new document is created
  if(this.isNew)
  {
    await sendVerificationEmail(this.email,this.otp)
  }
  next()
})

const OTP = mongoose.model('OTP',otpSchema)

module.exports = OTP