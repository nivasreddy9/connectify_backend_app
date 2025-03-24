const express = require("express");
const app = express();
const storage = require("../Database/mongo");
const authrouter = require("../Routers/auth");
const profile = require("../Routers/profile");
const requestrouter = require("../Routers/connections");
const userRouter = require("../Routers/userinterface");

const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cookieParser());

app.use(cors({
    origin: ["http://localhost:5173","https://frontend-connectifyy.vercel.app"], 
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true 
}));



// Middleware for JSON Parsing
app.use(express.json());

// Routes
app.use("/", authrouter);
app.use("/", profile);
app.use("/", requestrouter);
app.use("/", userRouter);

// Start Server
storage().then(() => {
    console.log("✅ Database has been connected");
    app.listen(1999, () => {
        console.log("🚀 Server is running on port 1999");
    });
});
