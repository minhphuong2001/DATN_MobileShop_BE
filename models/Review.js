const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { convertToSlug } = require("../utils/common");

const ProductSchema = new Schema(
	{
		rate: { type: Number, require: true },
		content: {type: String, require: true },
		user: {
			type: Schema.Types.ObjectId,
			ref: "users",
			require: true
		},
		product: {
			type: Schema.Types.ObjectId,
			ref: "products",
			require: true
		},
		order: {
			type: Schema.Types.ObjectId,
			ref: "orders",
			require: true
		},
	},
	{
		timestamps: true
	}
);

ProductSchema.pre("save", function () {
	this.slug = convertToSlug(this.product_name)
})

module.exports = mongoose.model("products", ProductSchema);
