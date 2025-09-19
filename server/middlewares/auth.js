const jwt = require('jsonwebtoken')
const User = require('../models/User')
require('dotenv').config()
//auth
const auth = (req,res,next)=>{
          try{
            console.log('Before taken extraction')
            //extract token 
            const token = req.cookies.token || req.body.token || 
                           req.header("Authorisation").replace('Bearer',"").trim()
           
            console.log('after token extraction')
           if(!token)
           {
              return res.status(401).json(
                {
                    success:false,
                    message:"token is missing"
                }
              )
           }
                
            //token verify
            try{
                const verifiedToken = jwt.verify(token,process.env.JWT_SECRET)
                console.log(verifiedToken)
                
                //inserting verifiedtoken in user
                 req.user= verifiedToken
             }catch(error)
            {
               //verification token failed
               return res.status(401).json(
                {
                    success:false,
                    message:"token invalid"
                }
               )
            }

        next()

          }catch(error)
          {
            return  res.status(401).json(
                {
                   success:false,
                   message:"Something went wrong"
                }
             )
          }
}


//isStudent
const isStudent = async(req,res,next)=>{
    try{
         if(req.user.accountType !== 'Student')
         {
            return res.status(401).json(
                {
                   success:false,
                   message:"This is protected route for Students only" 
                }
            )
         }
         next()

    }catch(error)
    {
        return res.status(500).json(
            {
                success:false,
                message:"User role not verified please try again "
            }
        )
    }
}

//isInstructor
const isInstructor = async(req,res,next)=>{
    try{
         if(req.user.accountType !== 'Instructor')
         {
            return res.status(401).json(
                {
                   success:true,
                   message:"This is protected route for Instructor only" 
                }
            )
         }
         next()

    }catch(error)
    {
        return res.status(500).json(
            {
                success:false,
                message:"User role not verified please try again "
            }
        )
    }
}


//isAdmin
const isAdmin = async(req,res,next)=>{
    try{
         if(req.user.accountType !== 'Admin')
         {
            return res.status(401).json(
                {
                   success:true,
                   message:"This is protected route for Admin only" 
                }
            )
         }
         next()

    }catch(error)
    {
        return res.status(500).json(
            {
                success:false,
                message:"User role not verified please try again "
            }
        )
    }
}


module.exports ={
    auth,
    isStudent,
    isInstructor,
    isAdmin
}