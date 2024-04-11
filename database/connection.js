import mongoose from 'mongoose';

async function connect() {
    try {
        const uri = "mongodb+srv://ITPM2024:ITPM2024@atlascluster.rhs2ett.mongodb.net/?retryWrites=true&w=majority";
        const db = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected");
        return db;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

export default connect;
