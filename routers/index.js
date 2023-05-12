const errorHandle = require("../middlewares/errorHandle");
const storageRouter = require("./storage");
const colorRouter = require("./color");
const categoryRouter = require("./category");
const authRouter = require("./auth");
const accRouter = require("./account");
const productRouter = require("./product");
const productVersionRouter = require("./product-version");
const cartRouter = require("./cart");
const orderRouter = require("./order");
const statisticalRouter = require("./statistical");
// const paypalRouter = require("./paypal");

module.exports = (app) => {

  app.use("/api/color", colorRouter)

  app.use("/api/storage", storageRouter)

  app.use("/api/category", categoryRouter)

  app.use("/api/product", productRouter)
  
  app.use("/api/product-version", productVersionRouter)

  app.use("/api/account", accRouter)

  app.use("/api/auth", authRouter)

  app.use("/api/cart", cartRouter)

  app.use("/api/order", orderRouter)

  app.use("/api/statistical", statisticalRouter)

  // app.use("/api/paypal", paypalRouter)
  
  app.use(errorHandle);

};
