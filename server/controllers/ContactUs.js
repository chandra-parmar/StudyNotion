
const mailSender = require('../utils/mailSender')
const contactUsEmail = require('../mail/templates/contactFormRes')

const contactUsController = async(req,res)=>{
    try{
      const {email, firstname,lastname,message,phoneno,countrycode} = req.body
      console.log(req.body)
      const emailRes= await mailSender(
        email,
        "Your data send successfully",
        contactUsEmail(email,firstname,lastname,message,phoneno,countrycode)
      )
      console.log('email res',emailRes)
      return res.status(200).json({
        success:true,
        message:"Email send successfully"
      })
    }catch(error)
    {
      console.log('error',error)
      console.log("error message",error.message)
      return res.json({
        success:false,
        message:"something went wrong"
      })
    }
}

module.exports = contactUsController