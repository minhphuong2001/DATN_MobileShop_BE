const errorHandle = require("../middlewares/errorHandle");
const storageRouter = require("./storage");
const colorRouter = require("./color");
const categoryRouter = require("./category");
const authRouter = require("./auth");
const accRouter = require("./account");
const productRouter = require("./product");

module.exports = (app) => {

  app.use("/api/color", colorRouter)

  app.use("/api/storage", storageRouter)

  app.use("/api/category", categoryRouter)

  app.use("/api/product", productRouter)



  app.use("/api/account", accRouter)

  app.use("/api/auth", authRouter)
  
  app.use(errorHandle);

};
