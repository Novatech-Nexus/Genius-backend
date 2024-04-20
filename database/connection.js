import mongoose from "mongoose";

async function connect(){

    mongoose.set('strictQuery', true)
    const db = await mongoose.connect(process.env.URI);
    console.log("Database connected");
    return db;
}
 
export default connect;