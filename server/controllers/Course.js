const Course = require('../models/Course')
const Category= require('../models/Category')
const User= require('../models/User')
const uploadImageToCloudinary = require('../utils/imageUploader')

//createCourse handler function
const createCourse = async(req,res)=>{
    try
    {
        //fetch data
        const {courseName,courseDescription,whatYouWillLearn,price,category, status,instructions } = req.body

        //get thumbnail
        const thumbnail = req.files.thumbnailImage

        //validation
       /* if(!courseName ||!courseDescription||!whatYouWillLearn||!price||!category ||!thumbnail)
        {
           return res.status(400).json(
            {
                success:false,
                message:"All fields are required"
            }
           ) 
        } */
        let courseStatus = status
        if(!courseStatus || courseStatus ===undefined)
        {
            courseStatus ="Draft"
        }

        // checking  for instructor 
        const userId = req.user.id 
        const instructorDetails = await User.findById(userId)
        console.log('instructor details ',instructorDetails)

        //todo verify user id and instructor id are same or different

        if(!instructorDetails)
        {
            return res.status(404).json(
                {
                    success:false,
                    message:"Instructor details not found"
                }
            )
        }

        //check given category is valid or not
        const categoryDetails = await Category.findById(category)

        if(!categoryDetails)
        {
            return res.status(404).json(
                {
                    success:false,
                    message:"category details not found"
                }
            )
        }

        //upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME)

        //entry for new course in db
        const newCourse = await Course.create(
            {
                courseName:courseName,
                courseDescription:courseDescription,
                instructor:instructorDetails._id,
                whatYouWillLearn:whatYouWillLearn,
                price,
                category:categoryDetails._id,
                thumbnail:thumbnailImage.secure_url,
                status:courseStatus,
                instructions:instructions
            }
        )

        //adding new course to the user schema of instructor
        await   User.findByIdAndUpdate(
            {_id:instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id
                }
            },
            {new:true}
        ) 

        //update category Schema TODO:
        await Category.findByIdAndUpdate(
            {_id:category},
            {
                $push:{
                   Category:newCourse._id
                }
            },
            {new:true}
        )

        //response
        return res.status(200).json(
            {
                success:true,
                message:"Course created successfully",
                data:newCourse
            }
        )




    }catch(error)
    {
        console.error(error)

     return res.status(500).json(
        {
            success:false,
            message:"Failed to create course",
            
            error:error.message 
        }
     )
    }
}


//get all course 
const getAllCourse = async(req,res)=>{
    try{
       const allCourses= await Course.find({},{
        courseName:true,
        price:true,
        thumbnail:true,
        instructor:true,
        ratingAndReviews:true,
        studentEnrolled:true
       }).populate('instructor').exec()

       return res.status(200).json(
        {
            success:true,
            message:"data fetch successfully",
            data:allCourses
        }
       )

    }catch(error)
    {
         console.log(error)
         return res.status(500).json(
            {
                success:false,
                message:"Cannot fetch course data",
                error:error.message
            }
         )
    }
}

//get full course details
const getCourseDetails = async(req,res)=>{
    try{
       //get id
       const {courseId} = req.body
       //find course details
       const courseDetails = await Course.find({_id:courseId})
                                            .populate(
                                                {
                                                    path:"instructor",
                                                    populate:{
                                                        path:"additionalDetails"
                                                    },
                                                }
                                            ).populate('category')
                                            .populate('ratingAndreviews')
                                            .populate({
                                                path:"courseContent",
                                                populate:{
                                                    path:"subSection"
                                                }
                                            })
                                            .exec()
         //validation
         if(!courseDetails)
         {
            return res.status(400).json(
                {
                    success:false,
                    message:`Could not find the course with ${courseId}`
                }
            )
         }
         //return response

         return res.status(200).json(
            {
                success:true,
                message:"Course details fetched successfully",
                data:courseDetails
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


module.exports ={
    createCourse,
    getAllCourse,
    getCourseDetails
}


