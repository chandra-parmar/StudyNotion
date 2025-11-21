const Course = require('../models/Course')
const Category= require('../models/Category')
const User= require('../models/User')
const uploadImageToCloudinary = require('../utils/imageUploader')
const Section = require('../models/Section')
const SubSection = require('../models/SubSection')
const ratingAndReviews = require('../models/RatingAndReview')
const CourseProgress = require('../models/CourseProgress')
const convertSecondsToDuration = require('../utils/secToDuration')

//createCourse handler function
const createCourse = async(req,res)=>{
    try
    {
        //fetch data
        const {courseName,courseDescription,whatYouWillLearn,price,category, status,instructions } = req.body

        //get thumbnail
       const thumbnail = req.files.courseImage

        //validation
        if(!courseName ||!courseDescription||!whatYouWillLearn||!price||!category ||!thumbnail)
        {
           return res.status(400).json(
            {
                success:false,
                message:"All fields are required"
            }
           ) 
        } 
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
                   courses:newCourse._id
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

// controllers/Course.js

// controllers/Course.js

const editCourse = async (req, res) => {
  try {
    const { courseId, courseName, courseDescription, whatYouWillLearn, price, instructions, status, category } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Update thumbnail if provided
    if (req.files && req.files.thumbnailImage) {
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
      course.thumbnail = thumbnailImage.secure_url;
    }

    // Update text fields if provided
    if (courseName) course.courseName = courseName;
    if (courseDescription) course.courseDescription = courseDescription;
    if (whatYouWillLearn) course.whatYouWillLearn = whatYouWillLearn;
    if (price) course.price = price;
    if (category) course.category = category;
    if (status) course.status = status;

    // Handle tag & instructions (they come as JSON string from FormData)
    
    if (instructions) {
      course.instructions = JSON.parse(instructions);
    }

    await course.save();

    // Fetch the updated course with correct populate paths (matching your schema!)
    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
    //  .populate("ratingAndreviews")  // ← Correct name from your schema!
      .populate({
        path: "courseContent",       // ← Correct: courseContent, not sections
        populate: {
          path: "subSection",
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });

  } catch (error) {
    console.error("Edit Course Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message,
    });
  }
};


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
                                            .populate('ratingAndReviews')
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

const getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get a list of Course for a given Instructor
const getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}

const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Unenroll students
    const studentsEnrolled = course.studentsEnrolled || [];
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    // Delete sections and subsections
    const courseSections = course.courseContent || [];
    for (const sectionId of courseSections) {
      // Correct usage of Section model
      const section = await Section.findById(sectionId);

      if (section) {
        // Correct field is "subSection"
        const subSections = section.subSection || [];

        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId);
    }

    // Remove course from instructor list
    await User.findByIdAndUpdate(course.instructor, {
      $pull: { courses: courseId },
    });

    // Delete from category as well
    await Category.findByIdAndUpdate(course.category, {
      $pull: { courses: courseId },
    });

    // Delete the course finally
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


module.exports ={
    createCourse,
    getAllCourse,
    getCourseDetails,
    getInstructorCourses,
    deleteCourse,
    getFullCourseDetails,
    editCourse

}


