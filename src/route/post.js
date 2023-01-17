const express = require('express');
const app = express.Router();
const postModel=require("../model/blog")

app.post("/post",async(req,res)=>{
    try{
        const post=await postModel.create(req.body);
        res.status(201).send({
            status:'Success',
            post,
            user:req.user
        })  
    }catch(err){
        res.status(404).send({
            status:'Failed',
            message:err.message
        })
    }
})

app.put("/post/:id",async(req,res)=>{
    try{
        const _id=req.params.id
        const post=await postModel.findOne({_id})
        if(post){
            await postModel.updateOne({_id},req.body)
            res.status(200).send({
                status:'Success',
                message:'Update Successfull'
            })
        }else{
            res.status(400).send({
                status:'Failed',
                message:"Post not found"
            })
        }
    }catch(err){
        res.status(400).send({
            status:"Failed",
            message:err.message
        })
    }
})

app.delete("/post/:id",async(req,res)=>{
    try{
        const _id=req.params.id
        const post=await postModel.findOne({_id})
        if(post){
            await postModel.deleteOne({_id})
            res.status(200).send({
                status:'Success',
                message:'Deleted Successfull'
            })
        }
    }catch(err){
        res.status(400).send({
            status:"Failed",
            message:err.message
        })
    }
})

module.exports=app