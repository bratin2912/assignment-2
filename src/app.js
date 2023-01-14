const express = require('express');
const app = express();
const userModel = require('../src/model/userModel');
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const secret='secret'
// Middlewares
// app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.post("/register",
    body('name').isAlpha(),
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 15 }),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                ststus:"Failed", 
                errors: errors.array() });
            }
            const { name, email, password } = req.body;

            const user = await userModel.findOne({ email });

            if (user) {
                return res.status(409).send({
                    status: "Failed to register",
                    message: "User already exists"
                })
            }

            bcrypt.hash(password, 10, async (err, hash) => {
                try{
                    if (err) {
                        return res.status(500).send({
                            status: "Failed",
                            message: err.message
                        })
                    }
                    const data = await userModel.create({
                        name,
                        email,
                        password: hash
                    })
                    return res.status(201).send({
                        status: "Success",
                        message:"User registration successfull",
                        data
                    })
                }catch(e){
                    return res.status(400).send({
                        status:"Failed",
                        message:e.message
                    })
                }
            })
        }catch(e){
            return res.status(400).send({
                status:"Failed",
                message:e.message
            })
        }
});

app.post("/login",
body('email').isEmail(),
body('password').isLength({min:6,max:15})
,async(req,res)=>{
    try{
        const errors=validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).send({
                status:"Failed",
                errors:errors.array()
            })
        }

        const{email,password}=req.body;

        const user=await userModel.findOne({email});

        if(!user){
            res.status(400).send({
                status:"Failed",
                message:"You have to register first"
            });
        }
        
        bcrypt.compare(password,user.password,async(err,result)=>{
            try{
                if(err){
                    return res.status(400).send({
                        status:"Failed",
                        message:err.message
                    })
                }
                if(result){
                    const token=jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        data: user._id
                    }, secret);
                    console.log(token.exp)
                    return res.status(400).send({
                        status:"Success",
                        message:"Successfully login",
                        token
                    })
                }
            
            }catch(e){
                return res.status(400).send({
                    status:'Failed',
                    message:e.message
                })
            }
        })
    }catch(e){
        return res.status(400).send({
            status:'Failed',
            message:e.message
        })
    }
})

module.exports = app