const ProductVersion = require("../models/ProductVersion");
const Order = require("../models/Order");
const User = require("../models/User");
const asyncHandle = require("../middlewares/asyncHandle");
const sendResponse = require("../helpers/SendResponse");

module.exports = {
  index: asyncHandle(async (req, res) => {
    const product = await ProductVersion.countDocuments();
    const order = await Order.countDocuments();
		const user = await User.countDocuments();
    const listOrders = await Order.find({});

    const totalAmount = listOrders.reduce((cur, acc) => {
      return cur + acc.total_amount;
    }, 0)

    return res.status(200).json({
      total_product: product,
      total_order: order,
      total_user: user,
      total_amount: totalAmount
    })
  }),
};
