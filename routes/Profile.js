const express = require('express')
const router = express.Router()

const {auth } = require('../middlewares/auth')

const {
     updateProfile,
    deleteAccount,
    getAllUserDetails

} = require('../controllers/Profile')

//update profile
router.put('/updateProfile',auth,updateProfile)

//delete profile
router.delete('/deleteProfile',auth,deleteAccount)

//all user details
router.get('/getuserDetails',auth,getAllUserDetails)

module.exports= router 