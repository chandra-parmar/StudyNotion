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
   showAllCategories,
    categoryPageDetails

}= require('../controllers/Category')

//rating review controllers import 
const{
    createRating,
    getAverageRating,
    getAllRating
} = require('../controllers/RatingAndReview')



//category routes only by admin
router.post('/createCategory',auth,isAdmin,createCategory)
router.get('/showAllCategories',showAllCategories)
router.post('/getCategoryPageDetails,',categoryPageDetails)

//course routes 
router.post('/createCourse',auth, isInstructor,createCourse)
router.get('/getAllCourses',getAllCourse)
router.post('/getCourseDetails',getCourseDetails)

//section routes only by instructor
router.post('/addSection',auth,isInstructor,createSection)
router.put('/updateSection',auth,isInstructor,updateSection)
router.delete('/deleteSection',auth,isInstructor,deleteSection)

//subsection routes only by instructor
router.post('/addSubSection',auth,isInstructor,createSubSection)
router.put('/updateSubSection',auth,isInstructor,updateSubSection)
router.delete('/deleteSubSection',auth,isInstructor,deleteSubSection)



// rating and review routes
router.post('/createRating',auth,isStudent,createRating)
router.get('/getAverageRating',auth,getAverageRating)
router.get('/getReviews',getAllRating)


module.exports = router

