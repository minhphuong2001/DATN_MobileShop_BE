const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductVersionSchema = new Schema(
	{
		price: { type: Number, require: true },
		sale_price: { type: Number, require: true },
		quantity: { type: Number, default: 1 },
		product: {
			type: Schema.Types.ObjectId,
			ref: "products",
			require: true
		},
		storage: {
			type: Schema.Types.ObjectId,
			ref: "storages",
		},
		color: {
			type: Schema.Types.ObjectId,
			ref: "colors",
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("product-versions", ProductVersionSchema);