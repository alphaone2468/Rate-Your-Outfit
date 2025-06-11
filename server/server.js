const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
require("./config/db");
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
const User=require("./models/user.model");
const Post=require("./models/post.model");

function verifyToken() {
    jwt.verify(req.body, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            return "error in verifying token"
        }

    })
}

function generateToken(req,res,next){
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3000 }, (err, data) => {
        if (err) {
            res.send("error in generating token");
        }
        else {
            next();
        }
    })
}


app.post("/login", async(req, res) => {
    console.log(req.body);
    let user=await User.findOne({email:req.body.email,password:req.body.password}).lean();
    if (user) {
        jwt.sign(user, process.env.JWT_SECRET, { expiresIn: 3000 }, (err, token) => {
            if (err) {
                console.log(err);
                res.status(500).json({status:"FAILED",message:"Error in generating token"});
            } else {
                console.log("Generated token:", token);
                res.cookie("access_token", token, {
                    httpOnly: true,
                    sameSite: "lax", 
                    secure: false
                });
                res.status(200).json({status:"SUCCESS",user:user});
            }
        });
    } else {
        res.status(401).json({status:"FAILED",message:"Invalid password"});
    }
});

console.log(process.env.PORT);



app.get("/profile", (req, res) => {
    console.log("whatch this",req.cookies);
    jwt.verify(req.cookies.access_token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            res.status(401).json({status:"FAILED",message:"Failed to verify Token please login"})
        }
        else {
            res.status(200).json({status:"SUCCESS",data:data});
        }
    })
})



app.post("/signup",async(req,res)=>{
    try{
        let data=await new User(req.body);
        data=await data.save();
        console.log(data);

        res.status(200).json({status:"SUCCESS",data});
    }
    catch(e){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
})

app.post("/signin",async(req,res)=>{
    try{
        let user=await User.findOne({email:req.body.email,password:req.body.password});
        if(user){
            res.status(200).json({user});
        }
        else{
            res.status(400).json({message:"Invalid Credentials"});
        }
    }
    catch(e){
        console.log(error);
        res.status(500).json({message:"Internal server error"});        
    }
})

// posts

app.get("/getPost",async(req,res)=>{
    try{
        const posts=await Post.find({}).limit(10);
        return res.status(200).json(posts);

    }
    catch(e){
        return res.status(500).json({message:"Internal Server Error"});
    }   
})
app.post("/addPost",async(req,res)=>{
    // console.log(req.body);
    console.log("cookie",req.cookies.access_token);
    let user;
    jwt.verify(req.cookies.access_token,process.env.JWT_SECRET,(err,data)=>{
        if(err){
            console.log("err",err);
        }
        else{
            console.log("data",data);
            req.user=data;
        }
    })
    try{
        let obj={...req.body,userId:req.user._id,userName:req.user.userName};
        let post = await new Post(obj);
        post = await post.save();
        return res.status(201).json({message:"Post Updated Successfully"});
    }
    catch(e){
        return res.status(500).json({message:"Internal Server Error"});

    }
})



app.listen(process.env.PORT, () => {
    console.log("Server running at Port ", process.env.PORT);
});