import mongoose from "mongoose";

const { Schema,model } = mongoose;

const supplierSchema = new Schema({
    suppID : { type: String ,required: true},
    suppName : { type: String ,required: true},
    suppEmail : { type: String ,required: true},
    suppPhone : { type: String ,required: true},
    suppDisc : {type: String ,required: true}
});

const Supplier = model("Supplier", supplierSchema);
export default Supplier;