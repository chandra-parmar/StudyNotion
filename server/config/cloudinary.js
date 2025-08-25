const cloudinary= require('cloudinary').v2
require('dotenv').config()

const cloudinaryConnect =()=>{
    try{
      cloudinary.config(
        {
            //configuration to upload media on cloudinary
            
            cloud_name:process.env.CLOUD_NAME,
            api_key:process.env.API_KEY,
            api_secret:process.env.API_SECRET
        }
      )
      console.log("cloudinay connected")
    }catch(error)
    {
      console.log(error)
    }
}

module.exports = cloudinaryConnect 