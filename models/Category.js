const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const CategorySchema = new Schema(
	{
		name: { type: String, required: true, unique: true },
		logo: { type: String, required: true },
		category_slug: {
			type: String,
			slug: 'name'
		}
	},
	{
		timestamps: true
	}
);

// CategorySchema.pre("save", function () {
// 	this.slug = convertToSlug(this.name);
// 	next();
// })

// CategorySchema.methods.getName = function() {
// 	return this.slug;
// };


module.exports = mongoose.model("categories", CategorySchema);
