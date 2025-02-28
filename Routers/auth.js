const express=require("express")
const authrouter=express.Router()
const storage=require("../Database/mongo")
const Subscriber=require("../schema/userschema")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const cookieParser = require("cookie-parser");
authrouter.use(cookieParser()); 
const userAuth=require("../middlewares/cookie")


authrouter.post("/signin",async(req,res)=>{
    try{
        const{Name,Email,Phone,Password,photoUrl}=req.body;
        const hashpassword=await bcrypt.hash(Password,10);
        const signinSave=new Subscriber({
            Name,
            Email,
            Phone,
            Password:hashpassword,  
            photoUrl
        })
        await signinSave.save()
        res.json({
            message:"Signin Successfull",
            data:signinSave
        })
    }catch(err){
        res.status(400).send(err.message)
    }
})

authrouter.post("/login",async(req,res)=>{
    try{
        const {Email,Password}=req.body;
        const find=await Subscriber.findOne({Email})
        if(!find){
            return res.status(400).json({message:"Invalid Email or Password"})

        }
        const isMatch=await bcrypt.compare(Password,find.Password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid Email or Password"})
        
        }else{
            const token=jwt.sign({_id:find._id},"nivasreddy")
            res.cookie("token",token)
            res.json({message:"Login Successfull",data:find})
        }


    }
    catch(err){
    res.status(400).send(err.message)
    }
})
authrouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    });
    res.send("logout success")
})
module.exports=authrouter;