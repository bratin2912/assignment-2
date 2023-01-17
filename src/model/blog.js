const mongoose=require('mongoose');
const id=mongoose.Schema.ObjectId
const blogSchema=new mongoose.Schema({
    title:{
        type:String
    },
    body:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    user:{
        type:String
    }
})

const blogModel=mongoose.model("post",blogSchema)

module.exports=blogModel;