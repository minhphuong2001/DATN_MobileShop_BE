const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const cors = require("cors");
const router = require("./routers");
const path = require("path");
const paypal = require("paypal-rest-sdk");
dotenv.config();

const asyncHandle = require("./middlewares/asyncHandle");
const { verifyAccessToken } = require("./middlewares/verifyToken");
const errorHandle = require("./middlewares/errorHandle");
const permission = require("./middlewares/permission");
const ErrorResponse = require("./helpers/ErrorResponse");
const User = require("./models/User");
const Cart = require("./models/Cart");
const Product = require("./models/Product");
const ProductVersion = require("./models/ProductVersion");
const Order = require("./models/Order");
const OrderDetail = require("./models/OrderDetail");
const mongoose = require("mongoose");

paypal.configure({
  mode: "sandbox",
  client_id:
    "AY9uhC43qxjVtkQaj6FGpLqEMo9l2ZiLzII-t65esfuPT69Imo6W4ScJWtsytPar9BpWuYKrSTxvQBwg",
  client_secret:
    "EEBROzMDrwyI1-ZtevlfBb5JGaaH5rHa2Fb0wnHmHygQEB_L-KFi0k02IlK3smFC09PqOFrbNSpNmTRR",
});

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors());

app.set("views", path.join(__dirname, "views"));
// app.engine("ejs", )
app.set("view engine", "ejs");

connectDB();
router(app);

app.post(
  "/api/paypal",
  verifyAccessToken,
  permission("user"),
  asyncHandle(async (req, res, next) => {
    const userId = req.userId;
    const { address, phone, note, carts, ...information } = req.body;
    const body = req.body;

    let id_order;

    if (!carts) {
      return next(new Error(400, "Lack of information"));
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const options = { session };

      const user = await User.findOne({ _id: userId }, null, options);

      if (!user) {
        await session.abortTransaction();
        session.endSession();

        return next(new ErrorResponse(404, "User not found"));
      }

      // Check for existing product in user's cart and delete them
      const productsInCart = await Promise.all(
        carts.map(async (cartId) => {
          const cart = await Cart.findOneAndDelete(
            { _id: cartId, user: userId },
            options
          ).populate({ path: "product_version", populate: "product" });

          const product = await Product.findById(
            cart.product_version?.product?._id,
            null,
            options
          );
          const productVer = await ProductVersion.findById(
            cart?.product_version?._id,
            null,
            options
          );

          product.sold += cart.quantity;
          productVer.quantity -= cart.quantity;
          if (productVer.quantity < 0) {
            return next(new ErrorResponse(404, "Inadequate product quantity"));
          }
          await product.save();
          await productVer.save();

          return cart;
        })
      );

      const totalAmount = productsInCart.reduce((total, cart) => {
        const { quantity, product_version } = cart;
        const { price } = product_version;
        const { discount } = product_version?.product;

        return total + quantity * (price * ((100 - discount) / 100));
      }, 0);

      const order = await Order.create(
        [
          {
            user: userId,
            address,
            phone,
            note,
            total_amount: totalAmount,
            information,
          },
        ],
        options
      );
      const newOrder = order[0];
      id_order = order[0]._id;
      await user.save();

      // Transfer money to recipient's account
      const receiver = await User.findOne(
        { email: "phuongnoo2001@gmail.com" },
        null,
        options
      );
      if (!receiver) {
        await session.abortTransaction();
        session.endSession();

        return next(new ErrorResponse(404, "Receiver not found"));
      }
      receiver.account_balance += totalAmount;
      await receiver.save();

      // Create array detail of order
      const orderDetailArray = productsInCart.map((cart) => {
        return {
          order: newOrder._id,
          product_version: cart.product_version._id,
          quantity: cart.quantity,
          discount: cart.product_version.product.discount,
          price: cart.product_version.price,
        };
      });

      const orderDetails = await OrderDetail.insertMany(
        orderDetailArray,
        options
      );

      // End session
      await session.commitTransaction();
      session.endSession();

      res.json({
        success: true,
        message: "Add order successfully",
        order: newOrder,
        orderDetails,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return next(new ErrorResponse(400, error.message));
    }

    console.log("Tao xong order: " + id_order);

    const dataOrder = body.carts.map((item) => {
      return {
        product_name: item.product_version.product.product_name,
        quantity: item.quantity,
        price:
          item.product_version.price -
          (item.product_version.price * item.product_version.product.discount) / 100,
        image: item.product_version.product.images[0]
      };
    });

    const USDCurrency = 23467;
    const totalPayment =
      dataOrder.reduce(
        (pre, curr) => pre + Number(curr.price) * Number(curr.quantity),
        0
      ) / USDCurrency;

    console.log("total: " + totalPayment);
    const createPaymentPaypal = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `http://localhost:5000/api/success?total=${totalPayment}&id_order=${id_order}`,
        cancel_url: "http://localhost:5000/api/cancel",
      },
      transactions: [
        {
          item_list: {
            items: dataOrder,
          },
          amount: {
            currency: "USD",
            total: totalPayment.toString(),
          },
          description: "Payment for products at DTMP Shop",
        },
      ],
    };

    paypal.payment.create(createPaymentPaypal, function (error, payment) {
      if (error) {
        console.log("Error when create payment: ", error);
        res.render('cancel');
      } else {
          for(let i = 0;i < payment.links.length;i++){
            if(payment.links[i].rel === 'approval_url'){
              res.redirect(payment.links[i].href);
              res.json(payment)
            }
          }
      }
    });
  })
);

app.get("/api/cancel", function (req, res) {
  res.render("cancel");
});

app.get("/api/success", function (req, res) {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const total = req.query.total;
    const id_order = req.query.id_order;

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: total,
          },
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async function (error, payment) {
        if (error) {
          console.log("Error success: " + error);
          res.render("cancel");
        } else {
          let shipping_address = payment.payer.payer_info.shipping_address;
          let address =
            shipping_address.recipient_name +
            " " +
            shipping_address.line1 +
            " " +
            shipping_address.line2 +
            " " +
            shipping_address.city +
            " " +
            shipping_address.state;

          let bd = {
            address: globalAddress || address,
            payment_method: "paypal",
          };

          let newOrder = await Order.findByIdAndUpdate(id_order, bd, {
            new: true,
          });

          res.render("success", {
            data: {
              payment: payment.transactions[0].item_list.items,
              order: newOrder,
            },
          });
        }
      }
    );
});

app.use(errorHandle);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
