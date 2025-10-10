require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT
const dbConnect = require('./config/database')
const cookieParser = require('cookie-parser')
const cors= require('cors')
const  cloudinaryConnect  = require('./config/cloudinary')
const dotenv = require('dotenv')
const fileUpload = require("express-fileupload")

const userRoutes = require('./routes/User')
const profileRoutes = require('./routes/Profile')
const courseRoutes = require('./routes/Course')
const paymentRoutes = require('./routes/Payment')




//database connect
dbConnect()
app.use(
    cors({
        //frontend url 
        origin:"http://localhost:3000",
        credentials:true 
    })
)
//middlewares
app.use(express.json())
app.use(cookieParser())

app.use(fileUpload({
   useTempFiles: true,
  tempFileDir: "/tmp/"
}))

//cloudinary connection
cloudinaryConnect()


//mount routes
app.use('/api/v1/auth',userRoutes)
app.use('/api/v1/profile',profileRoutes)
app.use('/api/v1/course',courseRoutes)
app.use('/api/v1/payment',paymentRoutes)


//default routes
app.get('/',(req,res)=>{
    return res.json(
        {
            success:true,
            message:"Hello world"
        }
    )
})



app.listen(port,()=>{
    console.log("server is running at port "+port)
})