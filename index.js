const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const cors = require("cors");
const router = require("./routers");
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());  
app.use(cors());

connectDB();
router(app);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
