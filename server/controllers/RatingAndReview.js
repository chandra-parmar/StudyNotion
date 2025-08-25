const RatingAndReviews = require('../models/RatingAndReview')
const Course = require('../models/Course')

//create rating
const createRating = async(req,res)=>{
    try{
       //get user id
       const userId = req.user.id 
       //fetch data from reqbody
       const {rating,review,courseId} = req.body
       //check isenrolled or not 
       const courseDetails = await Course.findOne(
                                        {_id:courseId,
                                        studentsEnrolled:{$eleMatch:{$eq:userId}},}
       )
       if(!courseDetails)
       {
        return res.status(404).json(
            {
                success:false,
                message:"Student  not enrolled in the course"
            }
        )
       }

       //check if user already reviewed the course(only one time review give)
       const alreadyReviewd = await RatingAndReviews.findOne(
        {
            user:userId,
            course:courseId 
        }
       )
       if(alreadyReviewd)
       {
        return res.status(403).json(
            {
                success:false,
                message:"Already reviewed"
            }
        )
       }
       //create rating and review
       const ratingReview= await RatingAndReviews.create({
                                            rating,review,
                                            course:courseId,
                                            user:userId
       })

       //attach with coures (update course)
      const updatedCourseDetails= await Course.findByIdAndUpdate({_id:courseId},{
                               $push:{
                                ratingAndReviews:ratingReview._id
                               }
       },{new:true})
       console.log(updatedCourseDetails)

       //return response
       return res.status(200).json(
        {
            success:true,
            message:"rating and review created successfully",
            ratingReview
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

//getaverage rating
const getAverageRating = async(req,res)=>{
    try{
        //get course id
        const courseId = req.body.courseId
        //calculate avg rating
        const result = await RatingAndReviews.aggregate([
            {
                $match:{
                        //converting string to objectid
                    course:new mongoose.Types.ObjectId(courseId)
                },
                

            
                 
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg :"$rating"}
                }
            }
        
        ])
        //return rating
        if(result.length>0)
        {
            return res.status(200).json(
                {
                    success:true,
                    averageRating:result[0].averageRating
                }
            )
        }

        //if no rating/review exist
        return res.status(200).json(
            {
                success:true,
                message:"Average rating 0 No rating given till now",
                averageRating:0
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

//getall rating
const getAllRating = async(req,res)=>{
    try{
        const allReviews = await RatingAndReviews.find({})
                                .sort({rating:"desc"})
                                .populate({
                                    path:"user",
                                    select:"firstName lastName email image"
                                })
                                .populate({
                                    path:"course",
                                    select:"courseName"
                                })
                                .exec()
                   return res.status(200).json(
                    {
                        success:true,
                        message:"All reviews fetch successfully",
                        data:allReviews
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
    createRating,
    getAverageRating,
    getAllRating
}
