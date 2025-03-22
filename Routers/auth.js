const express = require("express");
const authrouter = express.Router();
const Subscriber = require("../schema/userschema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

authrouter.use(cookieParser());

// 🔹 SIGNUP (No changes needed)
authrouter.post("/signin", async (req, res) => {
    try {
        const { Name, Email, Phone, Password, photoUrl, Age, Gender, About } = req.body;
        const hashpassword = await bcrypt.hash(Password, 10);
        const signinSave = new Subscriber({
            Name,
            Email,
            Phone,
            Password: hashpassword,
            photoUrl,
            Age,
            Gender,
            About
        });

        await signinSave.save();
        res.json({
            message: "Signin Successful",
            data: signinSave
        });
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// 🔹 LOGIN (Fixed Token Storage Issue)
authrouter.post("/login", async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const find = await Subscriber.findOne({ Email });

        if (!find) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        const isMatch = await bcrypt.compare(Password, find.Password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        // ✅ Generate JWT with Expiration
        const token = jwt.sign({ _id: find._id }, "nivasreddy", { expiresIn: "7d" });

        // ✅ Set Secure Cookie for Deployment
        res.cookie("token", token, {
            httpOnly: true,   // Prevents client-side access
            secure: true,     // ✅ Required for HTTPS (Vercel Enforces HTTPS)
            sameSite: "None", // ✅ Allows cross-site requests
        });

        res.json({ message: "Login Successful", data: find });
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// 🔹 LOGOUT (Fixed)
authrouter.post("/logout", async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        expires: new Date(0) // ✅ Expire the cookie
    });

    res.json({ message: "Logout Successful" });
});

module.exports = authrouter;
