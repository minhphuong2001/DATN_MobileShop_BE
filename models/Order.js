const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
	{
		phone: {
			type: String,
      match: /^[0][0-9]{9}$/,
			require: true
		},
		address: { type: String, require: true },
		note: { type: String, default: "" },
		status: {
			type: Number,
			enum: [1, 2, 3, 4, 5],
			default: 1
		},
		total_amount: { type: Number, require: true },
		payment_method: { 
			type: String,
			enum: ["onlinePayment", "onDeliveryPayment"],
			default: "onDeliveryPayment"
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "users",
			require: true
		},
		coupon: [{
			type: Schema.Types.ObjectId,
			ref: "coupons"
		}],
	},
	{
		timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
	}
);

OrderSchema.virtual("order_details", {
  ref: "order_details",
  localField: "_id",
  foreignField: "order",
  justOne: false,
});

module.exports = mongoose.model("orders", OrderSchema);