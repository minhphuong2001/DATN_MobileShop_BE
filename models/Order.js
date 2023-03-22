const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
	{
		total_amount: { type: Number, require: true },
		phone: {
			type: String,
      match: /^[0][0-9]{9}$/,
			require: true
		},
		address: { type: String, require: true },
		note: { type: String, default: "" },
		status: {
			type: Number,
			enum: [1, 2, 3, 4],
      require: true,
			default: 1
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "users",
			require: true
		},
		coupon: {
			type: Schema.Types.ObjectId,
			ref: "coupons"
		},
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("orders", OrderSchema);
