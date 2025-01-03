const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/db-config");

const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const premiumRoutes = require("./routes/premiumRoutes");
const forgotPassword = require("./routes/forgotPasswordRoute");
const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/orders");

const app = express();
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
app.use(forgotPassword);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((error) => {
    console.error("Failed to sync database:", error);
  });
