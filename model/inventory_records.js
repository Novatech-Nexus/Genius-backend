import mongoose from "mongoose";

const { Schema,model } = mongoose;

const recordSchema = new Schema({
    recId : { type: String},
    recQuantity: { type: Number},
    recKg: { type: String},
    recIn: {type: String},
    recOut: {type: String},
    recCost: {type: Number},
    recDate: {type: Date}

});

const Record = model("Record", recordSchema);
export default Record;