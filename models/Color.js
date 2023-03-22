const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ColorSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("colors", ColorSchema);
