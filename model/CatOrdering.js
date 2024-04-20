import mongoose from 'mongoose';

const { Schema } = mongoose;

const catOrderingSchema = new Schema({
    menuType: {
        type: String,
        required: true
    },
    noOfPer: {
        type: Number,
        required: true
    },
    fName: {
        type: String,
        required: true
    },
    lName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    conNum1: {
        type: Number,
        required: true
    },
    conNum2: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

const CatOrdering = mongoose.model("CatOrdering", catOrderingSchema);

export default CatOrdering;