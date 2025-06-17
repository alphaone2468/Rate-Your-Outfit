const mongoose=require("mongoose");


const commentsSchema = mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
},{_id: false});

const postSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
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
    },
    comments:[
        {
            type:commentsSchema
        }
    ],
})


const postModel=mongoose.model("Post",postSchema);

module.exports=postModel;