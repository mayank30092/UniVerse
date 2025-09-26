import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
    name:{type:String, required:true},
    email:{type:String,required:true,unique:true, match: /^\S+@\S+\.\S+$/,},
    password:{type:String,required:true},
    role:{
        type:String,
        enum:["student","admin"],
        default:"student",
    },
},
{timestamps:true}//will automatically add createdAt and updatedAt
);

export default mongoose.model("User", userSchema);