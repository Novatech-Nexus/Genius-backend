import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true }
});

const orderCartSchema = new mongoose.Schema({
  items: [cartItemSchema], // Array of cart items
  netTotal: { type: Number, required: true }, // Total price of all items
  createdAt: { type: Date, default: Date.now } // Date and time of creation (auto-generated)
});


const OrderCart = mongoose.model('OrderCart', orderCartSchema);

export default OrderCart;
