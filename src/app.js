const express = require('express');
const app = express();
const login=require("./route/login")
const jwt = require('jsonwebtoken');
const post=require("./route/post")
const secret="secret"
app.use(express.json());


app.post("/post",(req,res,next)=>{
    const token=req.headers.authorization;
    if(token){
        jwt.verify(token, secret, function(err, decoded) {
            if(err){
                return res.status(400).send({
                    status:'Failed',
                    message:err.message
                })
            }
            req.user=decoded.data;

            next();
        });
    }
    else{
        return res.status(400).send({
            status:'Failed',
            message:'Token is not authenticated'
        })
    }
})

app.put("/post",(req,res,next)=>{
    const token=req.headers.authorization;
    if(token){
        jwt.verify(token, secret, function(err, decoded) {
            if(err){
                return res.status(400).send({
                    status:'Failed',
                    message:err.message
                })
            }
            req.user=decoded.data;

            next();
        });
    }
    else{
        return res.status(400).send({
            status:'Failed',
            message:'Token is not authenticated'
        })
    }
})

app.use(post);

app.use(login);

module.exports = app