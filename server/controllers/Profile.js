const Profile = require('../models/Profile')
const User = require('../models/User')
const convertSecondsToDuration  = require('../utils/secToDuration')
const CourseProgress = require('../models/CourseProgress')
const mongoose = require('mongoose')
const Course = require('../models/Course')

const updateProfile = async(req,res)=>{
    try{
      //data fetch
      const {dateOfBirth="",about="",contactNumber,gender} = req.body
      //get userid
      const id = req.user.id 
      //validation
      if(!contactNumber ||!gender ||!id)
      {
        return res.status(400).json(
            {
                success:false,
                message:"All fields are required"
            }
        )
      }
      //find profile
      const userDetails = await User.findById(id)
      const profile = await Profile.findById(userDetails.additionalDetails)

      //update profile (coz already user exist)
      profile.dateOfBirth= dateOfBirth,
      profile.about= about
      profile.gender=gender
      profile.contactNumber=contactNumber

      
      
      //object save
      await profile.save()

      return res.status(200).json(
        {
            success:true,
            message:"Profile updated Successfully",
            profile 
        }
      )

    }catch(error)
    {
        console.log(error)
       return res.status(500).json(
        {
            success:false,
            error:error.message
        }
       )
    }
}


//delete account
const deleteAccount = async(req,res)=>{
    try{

        //get id 
        const id = req.user.id
        
        const user = await User.findById({_id:id})
        //  validation
        if(!user)
        {
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        // delete profile
        await Profile.findByIdAndDelete({_id:user.additionalDetails})
        //delete user
        await User.findByIdAndDelete({_id:id})
         
        
        //return response
        return res.status(200).json(
            {
                success:true,
                message:"User deleted successfully"
            }
        )


    }catch(error)
    {
       return res.status(500).json(
        {
            success:false,
            message:"User not deleted"
        }
       )
    }
}

//get user details
const getAllUserDetails = async(req,res)=>{
    try{
        //get user id 
        const id= req.user.id
      
        //get user details 
        const allUserDetails = await User.findById(id).populate('additionalDetails').exec()
        
        console.log(allUserDetails)
        return res.status(200).json(
            {
                success:true,
                message:"User data fetched successfully",
                data:allUserDetails
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

const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec()
    userDetails = userDetails.toObject()
    var SubsectionLength = 0
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0
      SubsectionLength = 0
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        )
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      })
      courseProgressCount = courseProgressCount?.completedVideos.length
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2)
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


module.exports ={
    updateProfile,
    deleteAccount,
    getAllUserDetails,
    getEnrolledCourses



}
