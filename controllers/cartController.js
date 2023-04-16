const ErrorResponse = require("../helpers/ErrorResponse");
const asyncHandle = require("../middlewares/asyncHandle");
const Cart = require("../models/Cart");
// const Product = require("../models/Product");
const ProductVersion = require("../models/ProductVersion");

module.exports = {
  add: asyncHandle(async (req, res, next) => {
    const userId = req.userId;
    const { product_version, quantity } = req.body;

    if (!(product_version && quantity)) {
      return next(new ErrorResponse(400, "Lack of information"));
		}
		
    const productVersion = await ProductVersion.findOne({ _id: product_version });
    if (!productVersion) {
      return next(new ErrorResponse(404, "Not found product"));
    }

    const cart = await Cart.findOne({ user: userId, product_version: product_version });

    if (cart) {
      cart.quantity += quantity;
      await cart.save();

      res.json({
        success: true,
        message: "The product has been added to cart",
        data: cart,
      });
    } else {
      const newCart = await Cart.create({
        user: userId,
        product_version: product_version,
        quantity,
      });

      res.json({
        success: true,
        message: "The product has been added to cart",
        data: newCart,
      });
    }
	}),
	
  getAll: asyncHandle(async (req, res, next) => {
    console.log(req);
    const userId = req.userId;
    const carts = await Cart.find({ user: userId })
      .populate("user")
      .populate({
        path: 'product_version',
        model: 'product_versions',
        populate: {
          path: 'product',
          model: 'products'
        }
     })

		res.json({
			success: true,
			message: "Get all cart",
			data: carts
		});
  }),

  getCount: asyncHandle(async (req, res, next) => {
    const userId = req.userId;
    const carts = await Cart.find({ user: userId });

		res.json({
			success: true,
			message: "Get number of product",
			count: carts.length
		});
  }),

  delete: asyncHandle(async (req, res, next) => {
    const userId = req.userId;
    const cartId = req.params.id;

    const cart = await Cart.findOneAndDelete({ user: userId, _id: cartId });

    if (!cart) {
      return next(new ErrorResponse(404, "Not found product in user's cart"));
    }

    res.json({
      success: true,
      message: "The product has been deleted by user"
    });
  }),

  update: asyncHandle(async (req, res, next) => {
    const userId = req.userId;
    const { productId, quantity } = req.body;

    if (!(productId && quantity)) {
      return next(new ErrorResponse(400, "Lack of information"));
    }

    const cart = await Cart.findOneAndUpdate(
      { user: userId, product: productId },
      { quantity },
      { new: true }
    ).populate("product_version");

    if (!cart) {
      return next(new ErrorResponse(404, "Not found product in user's cart"));
    }

    res.json({
      success: true,
      message: "The product has been updated",
      data: cart,
    });
  }),

  updateMany: asyncHandle(async (req, res, next) => {
    const { newCarts } = req.body;

    const carts = await Promise.all(
      newCarts.map(async (cart) => {
        if (cart.quantity === 0) {
          await Cart.findByIdAndDelete(cart._id);
          return null;
        } else {
          const newCart = await Cart.findByIdAndUpdate(cart._id, {
            quantity: cart.quantity,
          });
          return newCart;
        }
      })
    );

		res.json({
			success: true,
			message: "Carts has been updated",
			data: carts
		});
  }),
};
