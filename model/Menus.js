import mongoose from 'mongoose';

const { Schema } = mongoose;

const menuSchema = new Schema({
    itemId: { type: String, 
            required: true },

    itemName: { type: String, 
            required: true },

    category: { type: String, 
            required: true, enum: ['Beverage', 'Food', 'Set Menu','Catering Menu','Offers','Desserts'] },

    price: { type: Number, 
             required: true },

    description: {type:String} 
});

const Menus = mongoose.model("Menu", menuSchema); 

export default Menus;
