const express = require('express')
const app = express()
require('dotenv').config()

const port = process.env.PORT

const dbConnect = require('./config/database')
dbConnect()


app.listen(port,()=>{
    console.log("server is running at port "+port)
})