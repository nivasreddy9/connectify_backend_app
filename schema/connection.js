const mongoose=require("mongoose")
const Subscriber=require("./userschema")
const connectionrequest=new mongoose.Schema({
    fromuserid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true, 
        index:true,
        ref:"Subscriber"
    },
    touserid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true, 
        index:true,
        ref:"Subscriber"
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:"Invalid status"
        }
    },

},{timestamps:true},{
    strictPopulate: false
})

connectionrequest.pre("save",function(next){
    const connectionreq=this
    if(connectionreq.fromuserid.equals(connectionreq.touserid)){
        throw new Error("You can't send a connection request to yourself")
}
next()
}
);

const connectionrequestModel=mongoose.model("connectionrequest",connectionrequest)
module.exports=connectionrequestModel