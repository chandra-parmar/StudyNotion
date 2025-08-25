const User = require('../models/User')
const mailSender = require('../utils/mailSender')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
//reset password token
const resetPasswordToken = async(req,res)=>{
    try
    { 
        //get email from req body
          const {email} = req.body.email
        //check user for this email email validation
        const user  = await User.findOne({email:email})

        if(!user)
        {
            return res.json({
                success:false,
                message:"Your email is not registered"
            })
        }
        //generat token
        const token = crypto.randomBytes(20).toString('hex')
        //updating user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
            {
            email:email
            },
            {
                token:token,
                resetPasswordTokenExpires:Date.now()+5*60*1000
            },
            {
                new:true
            }
        )

        //url create
        const url = `http://localhost:3000/update-password/${token}`
        //send email containing the url
        await mailSender(email,"password Reset link",`Password reset link:${url} .please click this url to reset your password`)
         
         console.log(token)
        return res.status(200).json(
           

            {
                success:true,
                message:"Email sent successfully please check email"
            }
        )
         
        
    }catch(error)
    {
        console.log(error)
        return res.status(500).json(
            {
                error:error.message,
                success:false,
                message:"Something went wrong while sending email"
            }
        )

    }
}


//resetpassword
const resetPassword = async(req,res)=>{
    try{
        //data fetch
     const {password, confirmPassword,token } = req.body
        //validation
        if(password !==confirmPassword)
        {
             return res.status(401).json(
                {
                    success:false,
                    message:"password and confirm password not matched"
                }
             )
        }
        //get userdetails from db using token
        const userDetails= await User.findOne({token:token})
        // if no entry - invalid token
        if(!userDetails)
        {
            return res.json(
                {
                    success:false,
                    message:"token is invalid"
                }
            )
        }
        //token time check
        if(!(userDetails.resetPasswordExpries > Date.now()))
        {
             return res.status(403).json(
                {
                    success:false,
                    message:"Token is expired please regenerated your token"

                }
             )
        }
   
        //hash password
        const hashedPassword = await bcrypt.hash(password,10)

        //password update
        await User.findOneAndUpdate(
            {
                token:token
            },
            {
                password:hashedPassword
            },
            {
                new:true
            }
        )
        //return response
        return res.status(200).json(
            {
                success:true,
                message:"password reset successfully"
            }
        )


    }catch(error)
    {
        return res.status(500).json(
            {
                success:false,
                message:"something went wrong"
            }
        )
    }
}

module.exports={
    resetPasswordToken,
    resetPassword
}