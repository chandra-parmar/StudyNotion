const express = require('express')
const router = express.Router()

//import controller
const {signUp,login,sendOTP,changePassword} = require('../controllers/Auth')
const {resetPasswordToken,resetPassword} = require('../controllers/ResetPassword')

const {auth} = require('../middlewares/auth')


//authentication routes
router.post('/signup',signUp)
router.post('/login',login)
router.post('/sendotp',sendOTP)
router.post('/changepassword',auth,changePassword)

//reset password
router.post('/reset-password-token',resetPasswordToken)
router.post('/reset-password',resetPassword)

module.exports = router 