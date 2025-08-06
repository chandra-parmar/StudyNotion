const Course = require('../models/Course')
const Tag= require('../models/Tags')
const User= require('../models/User')
const {uploadImageToCloudinary} = require('../utils/imageUploader')

//createCourse handler function
const createCourse = async(req,res)=>{
    try
    {
        //fetch data
        const {courseName,courseDescription,whatYouWillLearn,price,tag } = req.body

        //get thumbnail
        const thumbnail = req.files.thumbnailImage

        //validation
        if(!courseName ||!courseDescription||!whatYouWillLearn||!price||!tag)
        {
           return res.status(400).json(
            {
                success:false,
                message:"All fields are required"
            }
           ) 
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

        //check given tag is valid or not
        const tagDetails = await Tag.findById(tag)

        if(!tagDetails)
        {
            return res.status(404).json(
                {
                    success:false,
                    message:"Tag details not found"
                }
            )
        }

        //upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME)

        //entry for new course in db
        const newCourse = await Course.create(
            {
                courseName,
                courseDescription,
                instructor:instructorDetails._id,
                whatYouWillLearn:whatYouWillLearn,
                price,
                tag:tagDetails._id,
                thumbnail:thumbnailImage.secure_url
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

        //update tag Schema TODO:
        await Tag.findByIdAndUpdate(
            {_id:tagDetails},
            {
                $push:{
                    tags:newCourse._id
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
            message:"Failed to create course"
            ,
            error:error.message 
        }
     )
    }
}


//get all course 
const getAllCourse = async(req,res)=>{
    try{
       const allCourses= await Course.find({})

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


module.exports ={
    createCourse,
    getAllCourse
}


