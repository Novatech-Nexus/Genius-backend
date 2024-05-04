import mongoose from "mongoose";

const { Schema, model } = mongoose;

const SalarySchema = new Schema({
  employeeID: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  basicamount: {
    type: String,
    required: true,
  },
  othours: {
    type: String,
    required: true,
  },
  amountperhour:{
    type: String,
    required: true,
  },
  month:{
    type: String,
    required: true,
  },
  amount:{
    type: String,
    required: true,
  }
});

const Salary = model("salary", SalarySchema);

export default Salary;