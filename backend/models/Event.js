import mongoose, { Schema } from "mongoose";

const registerationSchema = new mongoose.Schema({
    user:{type: Schema.Types.ObjectId, ref:"User", required:true},
    name: {type: String},
    email: {type: String},
    attended:{type:Boolean, default:false},
    registeredAt: { type: Date, default: Date.now },
    certificateIssued: { type: Boolean, default: false },
})

const attendanceSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  markedAt: { type: Date, default: Date.now },
});

const eventSchema = new mongoose.Schema(
    {
        title:{type:String, required:true, trim:true},
        description:{type:String, trim:true},
        date:{type:Date,required:true},
        time:{type:String},
        venue:{type:String, trim:true},
        //stores id of the author
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        //stores id of a participant
        participants:[registerationSchema],
        attendance:[attendanceSchema],
        requiresAttendance:{type:Boolean, default:false},
        image:{type:String, trim:true}
    },
    {timestamps:true}
);

export default mongoose.model("Event",eventSchema);