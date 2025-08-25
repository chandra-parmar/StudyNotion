const nodemailer = require('nodemailer')
require('dotenv').config()

//to send otp in email
const mailSender = async(email,title,body)=>{
    try{
        //transporter create
        let transporter = nodemailer.createTransport(
            {
                host:process.env.MAIL_HOST,
                port:465,
                secure:true,
                auth:{
                    user:process.env.MAIL_USER,
                    pass:process.env.MAIL_PASS
                },
                logger:true,
                debug:true 
            }
        )

      //email send
      let info = await transporter.sendMail(
        {
            from:`'Studynotion || by chinu' <${process.env.MAIL_USER}>`,
            to:email,
            subject:title,
            html:body
        }
      )
      console.log(info.messageId)
       return info
    }catch(error)
    {
        console.log(error.message)
        throw error
    }
}

module.exports = mailSender 