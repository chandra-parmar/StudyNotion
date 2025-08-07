const Profile = require('../models/Profile')
const User = require('../models/User')


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
      const profileId =  userDetails.additionalDetails
      const profileDetails = await Profile.findById(profileId)

      //update profile (coz already user exist)
      profileDetails.dateOfBirth= dateOfBirth,
      profileDetails.about= about
      profileDetails.gender=gender
      profileDetails.contactNumber=contactNumber

      
      
      //object save
      await profileDetails.save()

      return response.status(200).json(
        {
            success:true,
            message:"Profile updated Successfully",
            profileDetails
        }
      )

    }catch(error)
    {
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
        
        const userDetails = await User.findById(id)
        //  validation
        if(!userDetails)
        {
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        // delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails})
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

        return res.status(200).json(
            {
                success:true,
                message:"User data fetched successfully"
            }
        )

    }catch(error)
    {
      return res.status(500).json(
        {
            success:false,
            message:error.message
        }
      )
    }
}

module.exports ={
    updateProfile,
    deleteAccount,
    getAllUserDetails



}
