const express = require('express');
const app = express();
const userModel = require('../src/model/userModel');
const { body, validationResult } = require('express-validator');
const bcrypt=require("bcrypt")
// Middlewares
// app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.post("/register",body('name').isAlpha(),
body('email').isEmail(),
body('password').isLength({min:6,max:15}),
async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const{name,email,password}=req.body;

    const user=await userModel.findOne({email});

    if(user){
        return res.status(409).send({
            ststus:"Failed",
            message:"User already exists"
        })
    }

    bcrypt.hash(password,10,async(err,hash)=>{
        if(err){
            return res.status(500).send({
                status:"Failed",
                message:err.message
            })
        }
        const data=await userModel.create({
            name,
            email,
            password:hash
        })
        return res.status(201).send({
            status:"Success",
            data
        })
    })
});

module.exports=app