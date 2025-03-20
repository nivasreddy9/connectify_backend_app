const express=require("express")
const app=express()

const storage=require("../Database/mongo")
const authrouter=require("../Routers/auth")
const profile=require("../Routers/profile")
const requestrouter=require("../Routers/connections")
const userRouter=require("../Routers/userinterface")

const Subscriber=require("../schema/userschema")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cookieParser());  
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


app.use(express.json())

app.use("/",authrouter)
app.use("/",profile)
app.use("/",requestrouter)
app.use("/",userRouter)
storage().then(()=>{
    console.log("database has been connected");
    app.listen(1999,()=>{
        console.log("server is running on port 1999")
    })
})
