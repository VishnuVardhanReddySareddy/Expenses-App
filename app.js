const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const sequelize = require("./config/db-config");

const SignUpRouter = require("./routes/signup");

const app = express();
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/add-expense", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "expense.html"));
});

app.use(SignUpRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

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
