const mongoose=require("mongoose");

const userSchema = mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilePicture:{
        type:String,
        default:"https://www.w3schools.com/howto/img_avatar.png"
    },
    followers:{
        type:Array,
        default:[]
    },
    following:{
        type:Array,
        default:[]
    }
})


const userModel=mongoose.model("User",userSchema);

module.exports=userModel;