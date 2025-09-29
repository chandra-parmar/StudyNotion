const Category = require('../models/Category')


const createCategory = async(req,res)=>{
    try{

        //fetch data from req body
        const {name,description} = req.body
       
        //validation 
        if(!name ||!description)
        {
            return res.status(400).json(
                {
                    success:false,
                    message:"All fields are required"
                }
            )
        }

        //create entry in db
        const categoryDetails = await Category.create(
            {
                name:name,
                description:description
            }
        )
        console.log(categoryDetails)

        return res.status(200).json(
            {
                success:true,
                message:"category created successfully"
            }
        )

    }catch(error)
    {
        return res.status(500).json(
            {
                success:false,
                message:error.message
            }
        )

    }
}

//get all category
const showAllCategories = async(req,res)=>{
    try{
          const allCategory = await Category.find({},{name:true,description:true})
          return res.status(200).json(
            {
                success:true,
                message:"All category returned successfully",
                allCategory 
            }
          )
    }catch(error)
    {
        return res.status(500).json(
            {
                success:false,
                message:error.message
            }
        )

    }
}

//category page details
const categoryPageDetails = async(req,res)=>{
    try{
        //get category
        const {categoryId} = req.body 
        //get courses for specified categoryid
        const selectedCategory = await Category.findById(categoryId).
                                    populate('courses')
                                    .exec()
        //validation
        if(!selectedCategory)
        {
            return res.status(404).josn(
                {
                    success:false,
                    message:"Data not found"
                }
            )
        }
        //get courses for different category
        const differentCategory = await Category.find({
                _id:{$ne:categoryId}
        }).populate('courses')
        .exec()
        
          
        //return response
        return res.status(200).json(
            {
                success:true,
                data:{
                    selectedCategory,
                    differentCategory
                }
            }
        )
    }catch(error)
    {
      console.log(error)
      return res.status(500).json(
        {
            success:false,
            message:error.message
        }
      )
    }
}

module.exports ={
    createCategory,
   showAllCategories,
    categoryPageDetails
}