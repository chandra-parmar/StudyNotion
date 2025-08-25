const SubSection = require('../models/SubSection')
const Section = require('../models/Section')
require('dotenv').config()
const uploadImageToCloudinary = require('../utils/imageUploader')

//create subsection 
const createSubSection = async(req,res)=>{
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
        const {sectionId,title,description } = req.body
        const subSection = await SubSection.findById(sectionId)
       //validation
       if(!subSection)
       {
         return res.status(404).json(
            {
                success:false,
                message:"Subsection not found"
            }
         )
       }

       if(title !== undefined)
       {
        subSection.title =title
       }

        if(description !==undefined)
            {
                subSection.description = description
            }   
        if(req.files && req.files.video !==undefined)
            {
                const video = req.files.video
                const uploadDetails = await uploadImageToCloudinary(
                    video,
                    process.env.FOLDER_NAME
                )
                subSection.videoUrl =uploadDetails.secure_url
                subSection.timeDuration =`${uploadDetails.duration}`
            } 
            
            await subSection.save()

            return res.json(
                {
                    success:true,
                    message:"Section updated successfully"
                }
            )
       //update subsection


    }catch(error)
    {
      console.error(error)
      return res.status(500).json(
        {
            success:false,
            message:"Error occure while updating subsection"
        }
      )
    }
}

//delete subsection 
const deleteSubSection = async(req,res)=>{
    try{
        //fetch data (section id and subsection id)
        const {subSectionId, sectionId } = req.body
         //remove subsection from section 
         await Section.findByIdAndUpdate(
            {_id:sectionId},
            {
                $pull:{
                    subSection:subSectionId
                }
            }
         )
         const subSection = await SubSection.findByIdAndDelete({_id:subSectionId})

         if(!subSection)
         {
            return res.status(404).json(
                {
                    success:false,
                    message:"SubSection not found"
                }
            )
         }

         return res.json(
            {
                success:true,
                message:"subsection deleted Successfully"
            }
         )

    }catch(error)
    {
      console.error(error)
      return res.status(500).json(
        {
            success:false,
            message:"Error occured while deleting subsection"
        }
      )
    }
}

module.exports ={
    createSubSection,
    updateSubSection,
    deleteSubSection
}