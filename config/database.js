const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://minhphuongdo2001:minhphuong2001616@mobile-server.kifttwi.mongodb.net/test",
      {
        useCreateIndex: true, 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }
    );

    console.log("DB connection successfully!");
  } catch (err) {
    console.log("DB connection fail", err.message);
  }
};

module.exports = connectDB;
