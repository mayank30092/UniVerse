import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        title:{type:String, required:true, trim:true},
        description:{type:String, trim:true},
        date:{type:Date,required:true},
        venue:{type:String, trim:true},
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        participants:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
    ],
    },
    {timestamps:true}
);

export default mongoose.model("Event",eventSchema);