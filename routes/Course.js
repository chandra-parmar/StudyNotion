const express = require('express')
const router = express.Router()

//course controllers import
const {
     createCourse,
    getAllCourse,
    getCourseDetails
} = require('../controllers/Course')

//middlewares import
const { auth,
    isStudent,
    isInstructor,
    isAdmin } = require('../middlewares/auth')

//section controllers
const {createSection,
    updateSection,
    deleteSection}= require('../controllers/Section')

//subsection controller
const {
     createSubSection,
    updateSubSection,
    deleteSubSection
} = require('../controllers/SubSection')

//category controllers import
const{
     createCategory,
    showAllCategory,
    categoryPageDetails

}= require('../controllers/Category')

//rating review controllers import 
const{
    createRating,
    getAverageRating,
    getAllRating
} = require('../controllers/RatingAndReview')

//course routes
router.post('/createCourse',auth, isInstructor,createCourse)

//section routes only by instructor
router.post('/addSection',auth,isInstructor,createSection)
router.post('/updateSection',auth,isInstructor,updateSection)
router.post('/deleteSection',auth,isInstructor,deleteSection)
router.post('/addSubSection',auth,isInstructor,createSubSection)
router.post('/updateSubSection',auth,isInstructor,updateSubSection)
router.post('/deleteSubSection',auth,isInstructor,deleteSubSection)

router.get('/getAllCourses',getAllCourse)
router.post('/getCourseDetails',getCourseDetails)

//category routes only by admin
router.post('/createCategory',auth,isAdmin,createCategory)
router.get('/showAllCategory',showAllCategory)
router.post('/getCategoryPageDetails,',categoryPageDetails)


// rating and review routes
router.post('/createRating',auth,createRating)
router.get('/getAverageRating',auth,getAverageRating)
router.get('/getReviews',getAllRating)


module.exports = router

