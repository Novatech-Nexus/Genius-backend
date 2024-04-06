const mongoose =require("mongoose");


const dburl = "mongodb+srv://lakshitha:1234@cluster0.wweqlfn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.set("strictQuery", true,"useNewUrlParser", true);

const connection = async () => {
  try {
    await mongoose.connect(dburl);
    console.log("MongoDB Connected");
  }catch (e) {
    console.error(e.messege);
    process.exit();
  }
};

module.exports = connection;