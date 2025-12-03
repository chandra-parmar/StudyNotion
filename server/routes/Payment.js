const express = require('express')
const router = express.Router()

const {capturePayment,verifyPayment, sendPaymentSuccessEmailController } = require('../controllers/Payment')
const {auth,isStudent} = require('../middlewares/auth')

//routes
router.post('/capturePayment',auth,isStudent,capturePayment)
router.post('/verifyPayment',auth,isStudent,verifyPayment)
router.post('/sendPaymentSuccessEmail',auth,isStudent,sendPaymentSuccessEmailController)

module.exports =router 