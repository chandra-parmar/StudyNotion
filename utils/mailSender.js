const nodemailer = require('nodemailer')
require('dotenv').config()

//to send otp in email
const mailSender = async(email,title,body)=>{
    try{
        //transporter create
        let transporter = nodemailer.createTransport(
            {
                host:process.env.MAIL_HOST,
                auth:{
                    user:process.env.MAIL_USER,
                    pass:process.env.MAIL_PASS
                }
            }
        )

      //email send
      let info = await transporter.sendMail(
        {
            from:'Studynotion || by chinu',
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        }
      )
      console.log(info)
    
    }catch(error)
    {
        console.log(error.message)
    }
}

module.exports = mailSender 