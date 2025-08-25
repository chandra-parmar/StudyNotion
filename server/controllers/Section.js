const Section = require('../models/Section')

const Course = require('../models/Course')

const createSection  = async(req,res)=>{
    try{
         //data fetch
         const { sectionName ,courseId} = req.body

         //data validation
         if(!sectionName||!courseId)
         {
            return res.status(400).json(
                {
                    success:false,
                    message:"Missing property"
                }
            )
         }

         //create section
         const newSection = await Section.create({sectionName})

         //update course schema with section object id
         const updatedCourseDetails = await Course.findByIdAndUpdate(
                                      courseId,
                                      {
                                        $push:{
                                            courseContent:newSection._id
                                        }
                                      },
                                      {
                                        new:true
                                      }
                            
         ) 
         //Todo :populate 

         //return response 
         return res.status(200).json(
            {
                success:true,
                message:"Section created successfully",
                updatedCourseDetails
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

//update section 
const updateSection = async(req,res)=>{
    try
    {
        //fetch data
        const {sectionName ,sectionId} = req.body
        //validation
        if(!sectionName ||!sectionId)
        {
            return res.status(400).json(
                {
                    success:false,
                    message:"Missing properties"
                }
            )
        }

        //update data
        const updatedSection = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true})
        //return res
        return res.status(200).json(
            {
                success:true,
                message:"Section updated successfully"
            }
        )


    }catch(error)
    {
        console.log(error)
        return res.status(500).json(
            {
                success:false,
                message:"unable to update section"
            }
        )

    }
}

//delete section
const deleteSection = async(req,res)=>{
    try{
        //get id
        const { sectionId } = req.body

        //findbyid and delete
        await Section.findByIdAndDelete(sectionId)

        //update course also
          

        //return response
        return res.status(200).json(
            {
                success:true,
                message:"Section deleted Successfully"
            }
        )


    }catch(error)
    {
     return res.status(500).json(
        {
            success:false,
            message:"Unable to delete section"
        }
     )
    }
}

module.exports ={
    createSection,
    updateSection,
    deleteSection
}