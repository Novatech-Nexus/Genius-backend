import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    contactNumber: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    specialInstructions: {
      type: String
    },

  });

const Order = mongoose.model('Orderdetails', orderSchema);

export default Order;