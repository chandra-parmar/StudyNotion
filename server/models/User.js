const mongoose = require('mongoose')


const userSchema = new mongoose.Schema(
    {
      firstName:{
        type:String,
        require:true,
        trim:true,
      } ,
       lastName:{
        type:String,
        require:true,
        trim:true,
      },
      email:{
         type:String,
         required:true
      },
      password:{
        type:String,
        required:true
      },
      confirmPassword:{
        type:String,
         required:false
      },

      accountType:{
        type:String,
        enum:['Student','Instructor','Admin'],
        required:true
      },
      additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile",
        required:true

      },
      courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
      }],
      image:{
        type:String,
        required:true
      },
      token:{
        type:String
      },
      resetPasswordExpries:{
        type:Date
      },
      courseProgress:[
        {
          type:mongoose.Schema.Types.ObjectId,
         ref:"CourseProgress"
        }
    ]
      
    }
)

module.exports = mongoose.model("User",userSchema)