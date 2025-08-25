const User = require('../models/User')
const OTP = require('../models/OTP')
const otpgenerator = require('otp-generator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Profile = require('../models/Profile')
require('dotenv').config()

//send otp
const sendOTP = async(req,res)=>{
    try{
        //fetch email from req body
       const {email } = req.body

       //check if user already exist or not
       const existingUser = await User.findOne({email})
     
       //if user already exist
      if(existingUser)
      {
        return res.status(401).json(
            {
                success:false,
                message:"User already registered"
            }
        )
      }

      //generate otp
      let otp= otpgenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false
      })

      console.log("otp generated",otp)

      //check unique otp or not
      let result = await OTP.findOne({otp:otp})

      while(result)
      {
        otp = otpgenerator(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        })
        result  = await OTP.findOne({otp:otp})

      }

      const otpPayload = {email,otp}

      //create an entry for otp
      const otpBody = await OTP.create(otpPayload)
      console.log(otpBody)

      //return response successfull
      return res.status(200).json(
        {
            success:true,
            message:"OTP sent successfully",
            otp
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


//signup
const signUp = async(req,res)=>{
  try{
// data fetch from req body
   const {firstname,
    lastname,
    email,
    
    password,
    confirmPassword,
   
    accountType,
     otp
   } = req.body


// data validation
   if(!firstname ||!lastname ||
     !email || !password || !confirmPassword ||!accountType
    ||!otp)
    {
      console.log(error)
      return res.status(400).json(
        {
          
          success:false,
          message:"All fileds are required",
        
          
        }
      )
    }

//password and confirm password match 
 if(password !== confirmPassword)
 {
     return res.status(400).json(
      {
        success:false,
        message:"Password and Confirm password does not match"
      }
     )
 }

//check user already exist or not
 const existingUser = await User.findOne({email})

 if(existingUser)
 {
  return res.status(400).json(
    {
      success:false,
      message:"User is already registered"
    }
  )
 }

// find recent otp for the user
const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1)
console.log(recentOtp)

//vaildate otp found or not
if(recentOtp.length === 0)
{
   return res.status(400).json(
    {
      success:false,
      message:"Otp not found"
    }
   )
}

//invalid otp
else if (String(otp).trim()!==String(recentOtp[0].otp).trim())
{
   return res.status(400).json(
    {
      success:false,
      message:"Invalid otp"
    }
   )
}


//hash password
const hasedPassword = await bcrypt.hash(password,10)

//enter in db
const profileDetails = await Profile.create(
  {
    gender:null,
    dateOfBirth:null,
    about:null,
    contactNumber:null 
  }
)


 const user = await User.create(
  {
    firstname,
    lastname,
    email,
  
    password:hasedPassword,
    accountType,
    additionalDetails:profileDetails._id,
     image:`https://api.dicebear.com/5.x.initials/svg?seed =${firstname} ${lastname}`
  }
 )

 //return response
 return res.status(200).json(
  {
    success:true,
    message:"user regireded successfully",
    user
  }
 )
  }catch(error)
  {
    console.log(error)
     return res.status(500).json(
      {
        success:false,
        message:"user cannot be registered "
      }
     )
  }
}
   
//login
const login = async(req,res)=>{
    try{
        //data fetch from req body
        const {email,password } = req.body

        //validation
        if(!email ||!password)
        {
          return res.status(400).json(
            {
              success:false,
              message:"All fields are required please try again  "
            }
          )
        }
        //user check registered or not
        const user = await User.findOne({email})
       if(!user)
       {
        return res.status(401).json(
          {
            success:false,
            message:"User is not registred"
          }
        )
       }
        //password matching
        if(await bcrypt.compare(password,user.password))
        {
          //PAYLOAD create
          const payload = {
            email:user.email,
            id:user._id,
            accountType:user.accountType
          }

            //token generate
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
              expiresIn:"2h"
            })
            //inserting token in user object
          user.token=token
          user.password = undefined;

          //generate cookie
               //create option
         const options = {
          expires:new Date(Date.now() + 3*24*60*60*1000),
          httpOnly:true
         } 
          res.cookie('token',token,options).status(200).json({
          success:true,
          token,
          user,
          message:"User logged in successfully"
         })
       }
       else
       {
          return res.status(401).json(
            {
              success:false,
              message:"Password is incorrect"
            }
          )
       }
        


    }catch(error)
    {
       console.log(error)
       return res.status(500).json(
        {
          success:false,
          message:"Login failed"
        }
       )

    }
}

//To do :->
//changepassword
const changePassword = async(req,res)=>{
      try{
        //get data from request body
        //get old password ,newpassword ,confirmnewpassword
        //validation
        //update password in db
        //send email password updated 

        
      }catch(error)
      {

      }
}

module.exports ={
    sendOTP,
    signUp,
    login,
    changePassword
}
