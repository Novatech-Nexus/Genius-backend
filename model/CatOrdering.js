import mongoose from 'mongoose';

const { Schema } = mongoose;

const catOrderingSchema = new Schema({
      functionType:{
        type: String, 
        required: false
      },  
      menuType: {
        type: [String], 
        required: false
      },
      noOfPer: { 
        type: Number,
        required: false,
        min: 25,
        max: 1000
      },
      fName: {
        type: String,
        required: false
      },
      lName: {
        type: String,
        required: false
      },
      email: {
        type: String,
        required: false
      },
      conNum1: {
        type: Number,
        required: false
      },
      conNum2: {
        type: Number,
        required: false
      },
      date: {
        type: Date,
        required: false
      },
      time: {
        type: String,
        required: false
      },
      address: {
        type: String,
        required: false
      },
      perPersonPrice:{
        type: Number,
        required: false
      },
      totalPrice:{
        type: Number,
        required: false
      }
    });
    
const CatOrdering = mongoose.model("CatOrdering", catOrderingSchema);

export default CatOrdering;