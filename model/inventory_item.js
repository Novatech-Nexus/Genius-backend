import mongoose from 'mongoose';

const { Schema,model } = mongoose;

const itemSchema = new Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    igroup: { type: String },
    quantity: { type: Number },
    kg: { type: String },
    cost: { type: Number },
    addDate : {type:Date,required: true},
    discription : { type: String}
});

const Item = model("Item", itemSchema);

export default Item;
