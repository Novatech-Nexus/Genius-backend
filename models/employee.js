const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
       employeeID: {
        type: String,
        required: true,
       },
       firstname: {
        type:String,
       },
       lastname: {
        type:String,
       },
       gender:{
        type:String,
       },
       nic: {
        type:String,
        required:true,
       },
       email: {
        type:String,
       },
       jobtype: {
        type:String,
       },
       mobile: {
        type:String,
       },
       address: {
        type:String,
       },
       city: {
        type:String,
       }

       
});

module.exports = Employee = mongoose.model("employee", EmployeeSchema);