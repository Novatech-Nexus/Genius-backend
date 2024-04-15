const mongoose = require('mongoose')

const Schema = mongoose.Schema

const accountmodelSchema = new Schema({
    userName: {
        type:String,
        required: true
    },
    contactNo: {
        type: String,
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
    category: {
        type: String,
        required: true
    },
    tNumber:{
        type : String,
        required: true
    },
    nGuest: {
        type: String,
        required: true
    }
    
}, { timestamps: true})

module.exports = mongoose.model('accountmodel' , accountmodelSchema)