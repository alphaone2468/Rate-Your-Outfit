const mongoose=require("mongoose");

const postSchema = mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    overAllRatings:{
        type:Number,
        default:0
    },
    noOfRatings:{
        type:Number,
        default:0
    }
})


const postModel=mongoose.model("Post",postSchema);

module.exports=postModel;