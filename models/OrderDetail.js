const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderDetailSchema = new Schema(
	{
		price: { type: Number, require: true },
		quantity: { type: Number, require: true },
		discount: { type: Number, default: 0 },
		order: {
			type: Schema.Types.ObjectId,
			ref: "orders",
			require: true
		},
		product_version: {
			type: Schema.Types.ObjectId,
			ref: "product_versions",
			require: true
		},
	},
	{
		timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
	}
);

OrderDetailSchema.virtual('amount').get(function() {
	return this.quantity * ( this.price - this.price * (this.discount/100));
})

module.exports = mongoose.model("order_details", OrderDetailSchema);
