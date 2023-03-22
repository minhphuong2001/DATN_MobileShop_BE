const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductImageSchema = new Schema(
	{
		images: { type: [String], require: true },
		product: {
			type: Schema.Types.ObjectId,
			ref: "products",
			required: true
		},
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("product-images", ProductImageSchema);
