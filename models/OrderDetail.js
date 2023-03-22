const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { convertToSlug } = require("../utils/common");

const OrderDetailSchema = new Schema(
	{
		price: { type: Number, require: true },
		quantity: { type: Number, require: true },
		order: {
			type: Schema.Types.ObjectId,
			ref: "orders",
			require: true
		},
		product_version: {
			type: Schema.Types.ObjectId,
			ref: "product-versions",
			require: true
		},
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("order-detail", OrderDetailSchema);
