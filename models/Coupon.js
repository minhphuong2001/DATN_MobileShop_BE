const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CouponSchema = new Schema(
	{
		code: { type: String, require: true },
		value: {type: Number, require: true },
		status: { type: Number, default: 0 },
		plan_quantity: { type: Number, default: 0 },
		actual_quantity: { type: Number, default: 0 }
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("coupons", CouponSchema);
