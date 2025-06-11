const mongoose=require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/Rate-your-outfit").then(()=>{
    console.log("Connected to Mongodb")
}).catch(()=>{
    console.log("Error in connecting to Mongodb");
})