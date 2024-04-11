import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    rating:{
        type: Number,
        required: true,
    },
    diningExperience:{
        type:String,
    },
    foodQuality:{
        type:String,
    },
    service:{
        type:String,
    },
    price:{
        type:String,
    },
    menuSelection:{
        type:Number,
        required: true,
    },
    onlineSelection:{
        type:Number,
        required: true,
    },
    cateringSelection:{
        type:Number,
        required: true,
    },
    responseSelection:{
        type:Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved'],
        default: 'pending'
    }
}, {timestamps: true});

const feedback = mongoose.model('feedback',feedbackSchema);
export default feedback;