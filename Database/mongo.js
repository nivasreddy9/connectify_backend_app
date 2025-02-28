const mongoose=require("mongoose")
const storage=async()=>{
    await mongoose.connect("mongodb+srv://NivasReddy:NAna21032002%40@mynode.hlk7x.mongodb.net/?retryWrites=true&w=majority&appName=Mynode")
}

module.exports=storage;