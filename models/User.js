const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid.",
      ],
      trim: true,
    },
    password: {
      type: String,
      require: true,
      minlength: 8,
    },
    fullname: {
      type: String,
      default: ""
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    address: {
      type: String,
      default: ""
    },
    phone: {
      type: String,
      match: /^[0][0-9]{9}$/,
      default: ""
    },
    account_balance: {
      type: Number,
      default: 0,
      min: 0,
    },
		deleted: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", UserSchema);