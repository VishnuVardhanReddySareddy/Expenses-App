const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
// const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const sequelize = require("./config/db-config");

const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const premiumRoutes = require("./routes/premiumRoutes");
const forgotPasswordRoutes = require("./routes/forgotPasswordRoute");
const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/orders");
const ForgotPasswordRequest = require("./models/ForgotPasswordRequest");

const app = express();
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"], // Allow loading resources from your own domain
//       scriptSrc: [
//         "'self'", // Allow scripts from your domain
//         "'unsafe-inline'", // Allow inline scripts (only if necessary)
//         "'unsafe-eval'", // Allow eval (for some libraries like React DevTools)
//         "https://checkout.razorpay.com", // Allow Razorpay checkout
//         "https://cdn.jsdelivr.net", // Allow Axios from JSDelivr
//       ],
//       styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles (for some frameworks)
//       imgSrc: ["'self'", "https://cdn.jsdelivr.net"], // Allow images from JSDelivr (if needed)
//       frameSrc: [
//         "'self'",
//         "https://checkout.razorpay.com", // Allow Razorpay Checkout iframe
//         "https://api.razorpay.com", // Allow Razorpay API iframe
//       ],
//     },
//   })
// );
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));

app.get("/add-expense", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "expense.html"));
});

app.use(userRoutes);
app.use(expenseRoutes);
app.use(purchaseRoutes);
app.use("/premium", premiumRoutes);
app.use("/password", forgotPasswordRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

// Define associations
ForgotPasswordRequest.belongsTo(User);
User.hasMany(ForgotPasswordRequest);

sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
    app.listen(3000, () => {
      console.log(`Server is running on http://localhost:3000`);
    });
  })
  .catch((error) => {
    console.error("Failed to sync database:", error);
  });
