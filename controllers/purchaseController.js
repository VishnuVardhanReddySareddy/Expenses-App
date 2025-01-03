const Razorpay = require("razorpay");
const Order = require("../models/orders");
const jwt = require("jsonwebtoken");

exports.purchasepremium = async (req, res) => {
  try {
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amount = 2500;

    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }

      req.user
        .createOrder({ orderid: order.id, status: "PENDING" })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const { payment_id, order_id } = req.body;

    // Find the order by order_id
    const order = await Order.findOne({ where: { orderid: order_id } });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order status to 'SUCCESSFUL' if payment is successful
    if (payment_id) {
      await order.update({ paymentid: payment_id, status: "SUCCESSFUL" });

      // Update user status to 'ispremiumuser' as true after successful transaction
      await req.user.update({ ispremiumuser: true });

      // Generate a new token with updated ispremiumuser status
      const token = jwt.sign(
        { userId: req.user.id, ispremiumuser: true },
        process.env.SECRET_KEY
      );

      return res
        .status(202)
        .json({ success: true, message: "Transaction Successful", token });
    } else {
      // If payment failed, update the order status to 'FAILED'
      await order.update({ status: "FAILED" });

      return res
        .status(400)
        .json({ success: false, message: "Transaction Failed" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};
