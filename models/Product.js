const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const ProductSchema = new Schema(
	{
		product_name: { type: String, require: true },
		description: {type: String, require: true },
		specification: { type: String, require: true },
		images: { type: [String], require: true },
		discount: { type: Number, default: 0 },
		deleted: { type: Number, default: 0 },
		price: { type: Number, default: 0 },
		sold: { type: Number, default: 0 },
		slug: {
			type: String,
			slug: 'product_name'
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: "categories",
			require: true
		},
	},
	{
		timestamps: true
	}
);

// ProductSchema.pre("save", function () {
// 	this.slug = convertToSlug(this.product_name)
// })

module.exports = mongoose.model("products", ProductSchema);
