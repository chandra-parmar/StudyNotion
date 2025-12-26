const express = require('express')
const router = express.Router()

const { auth, isInstructor } = require('../middlewares/auth')

const {
     updateProfile,
    deleteAccount,
    getAllUserDetails,
    getEnrolledCourses,
    instructorDashboard

} = require('../controllers/Profile')

//update profile
router.put('/updateProfile',auth,updateProfile)

//delete profile
router.delete('/deleteProfile',auth,deleteAccount)

//all user details
router.get('/getuserDetails',auth,getAllUserDetails)

//get enrolled course details
router.get('/getEnrolledCourses',auth,getEnrolledCourses)

router.get('/instructorDashboard',auth,isInstructor,instructorDashboard)

module.exports= router 