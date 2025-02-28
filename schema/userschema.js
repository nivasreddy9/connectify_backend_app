const mongoose=require("mongoose")
const validator=require("validator")
const details=new mongoose.Schema({
    Name:{ 
        type:String,
        required:true,
        unique:true,
        minlength: 3,  
    }, 
    Email:{
    type:String,
    required:true,
    unique:true,
    validate(value){
        if(!validator.isEmail(value)){
            throw new Error("email is not valid")
    }


    }
},
    Phone:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isMobilePhone(value)){
                throw new Error("not a correct number")
        }
    
    
        }
        }
,
    Password:{
        required:true,
        type:String,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("password is not strong")
            }
        }
    },
    photoUrl: {
        type: String, 
        required: true,
        validate: {
          validator: function (value) {
            return validator.isURL(value, { protocols: ["http", "https"], require_protocol: true });
          },
          message: "Invalid photo URL",
        },
      },
},{timestamps:true})
const Subscriber=mongoose.model("Subscriber",details)
module.exports=Subscriber