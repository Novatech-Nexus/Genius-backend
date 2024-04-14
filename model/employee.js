import mongoose from "mongoose";

const { Schema, model } = mongoose;

const EmployeeSchema = new Schema({
  employeeID: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  gender: {
    type: String,
  },
  nic: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  jobtype: {
    type: String,
  },
  mobile: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
});

const Employee = model("employee", EmployeeSchema);

export default Employee;
