const SubSection = require('../models/SubSection')
const Section = require('../models/Section')
require('dotenv').config()

//create subsection 
const createSection = async(req,res)=>{
    try{
         //fetch data 
         const {sectionId,title,timeDuration,description} =req.body
         //extract file video
         const video = req.files.videoFile
         //validation
         if(!sectionId ||!title ||!timeDuration||!description ||!video)
            {
                return res.status(400).json(
                    {
                        success:false,
                        message:"All Fields are required"
                    }
                )
            } 
         //upload video to cloudinary
         const uploadDetails = await uploadImageToCloudinary(
            video,
            process.env.FOLDER_NAME
        )
         //create subsection
         const SubSectionDetails = await SubSection.create(
            {
                title:title,
                timeDuration:timeDuration,
                description:description,
                videoUrl:uploadDetails.secure_url
            }
         )

         //insert subsection id into section
         const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
            {
                $push:{
                    subSection:SubSectionDetails._id
                }
            },
            {new:true}
         ).populate('subSection')
         // Todo  updatesection after adding populate query

         //return response
         return res.status(200).json(
            {
                success:true,
                message:"Subsection created successfully"
            }
         )
    }catch(error)
    {
        console.log(error)
       return res.status(500).json(
        {
            success:false,
            message:"Internal server error",
            error:error.message
        }
       )
    }
}

//update subsection
const updateSubSection = async(req,res)=>{
    try{
        //fetch data 
        const {title,timeDuration,description} = req.body
       //validation
       //update subsection


    }catch(error)
    {

    }
}

//delete subsection 
const deleteSubSection = async(req,res)=>{
    try{

    }catch(error)
    {

    }
}