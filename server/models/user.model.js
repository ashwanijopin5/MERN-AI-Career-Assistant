import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
        
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    avatar:{
        public_id:String,
        url:String
        
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    isVerified:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

export const User=mongoose.model("User",userSchema)