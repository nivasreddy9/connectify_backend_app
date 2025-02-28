const express=require("express");
const connectionrequestModel=require("../schema/connection")
const Subscriber=require("../schema/userschema")


const userAuth = require("../middlewares/cookie");
const userRouter=express.Router();


userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try{
        const loggeduser=req.user   
        const connectionrequests=await connectionrequestModel.find({
            touserid:loggeduser._id,
            status:"interested"
        }).populate("fromuserid",["Name"])

        res.json({
            message:"data fetched",data:connectionrequests
        })
    }catch(err)
    {
        res.send("email not found"+err.message)
    }
})


userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggeduser=req.user
        const connections=await connectionrequestModel.find({
            $or:[
                {touserid:loggeduser._id,status:"accepted"},
                {fromuserid:loggeduser._id,status:"accepted"}
            ]

        }).populate("fromuserid",["Name"])
        res.json({
            message:"data fetched",data:connections
        })
    }catch(err){
        res.send("email not found"+err.message)
    }
})

userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
        const loggeduser=req.user;
        const page=parseInt(req.query.page)||1;
        let limit=parseInt(req.query.limit)||10;
        limit=limit>50?50:limit;
        const skip=(page-1)*limit;


    const connectionreq=await connectionrequestModel.find({
        $or:[
       { touserid:loggeduser._id},
        {fromuserid:loggeduser._id}
    ]
    }).populate("fromuserid",["Name"])
    const hidinguser=new Set();
    connectionreq.forEach((req)=>{
        hidinguser.add(req.fromuserid.toString());
        hidinguser.add(req.touserid.toString());
    })

    
    const users=await Subscriber.find({
        $and:[{_id:{$nin:Array.from(hidinguser)},
        _id:{$ne:loggeduser._id}}]
    })
 
    // console.log(users);
    
    res.json(users)
}catch(err){
    res.send("email not found"+err.message)
}
})


module.exports=userRouter