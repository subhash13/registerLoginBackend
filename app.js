const express = require('express');
const cors = require('cors'); //cross origin resource sharing
const app = express();

const User = require('./model/data') // importing mongoose model

const mongoose = require('mongoose');
mongoose.set('strictQuery',false); //to avoid warning 

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended:false }));
app.use(cors()) //specifying to use cors

const db = "mongodb://localhost:27017/registerLogin"
mongoose.connect(db).then(()=>{
    console.log("connection established");
})

app.post('/login',(req,res)=>{
    User.findOne( {email: req.body.email},(err,userData)=>{
        if (userData) {
            if(req.body.password == userData.password ){
                res.send({message:'login successful'});
            }else{
                res.send({message:'login failed'});
            }
        }else{
            res.send({message:'user not found'});
        }
    } )
})

app.post('/register',async(req,res)=>{
    User.findOne( {email: req.body.email}, (err,userData)=>{
        if (userData) {
            res.send( { message:"User already registered" } )
        } else {
            let userData = new User({
              name: req.body.name,
              email: req.body.email,
              password: req.body.password  
            })
            userData.save(()=>{
                if (err) {
                    res.send(err)
                } else {
                    res.send({message:"User registered successfully"})
                }
            } )
        }
    } )
})

app.listen(4000,()=>{
    console.log("listening on port 4000");
});