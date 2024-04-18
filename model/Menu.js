import mongoose from 'mongoose';

const { Schema } = mongoose;

const menuSchema = new Schema({
    itemId: { type: String, required: true, unique: true },
    itemName: { type: String, required: true },
    category: { type: String, required: true, enum: ['Beverage', 'Food', 'Set Menu','Catering Menu','Offers'] },
    price: { type: Number, required: true },
    description: { type: String, required: true }
});

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;
