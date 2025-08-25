const Razorpay = require('razorpay')


//instance of razorpay
const instance = new Razorpay(
    {
        key_id: process.env.RAZORPAY_KEY,
       key_secret: process.env.RAZORPAY_SECRET, 
    }
)

module.exports = instance 