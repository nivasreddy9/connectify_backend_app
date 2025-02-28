const jwt=require("jsonwebtoken");
const Subscriber=require("../schema/userschema")
const userAuth=async(req,res,next)=>{
    try{
        const {token}=req.cookies;
        if(!token){
            throw new Error("token is required");
        }
        const decoded=jwt.verify(token,"nivasreddy");
        const{_id}=decoded;
        const user=await Subscriber.findById(_id);
        if(!user){
            throw new Error("user not found and signup for login");
        } 
        req.user=user;
        next();



}catch(err){
    res.status(400).send("error "+err.message)
}
}

module.exports=userAuth;