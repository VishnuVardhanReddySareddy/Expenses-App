const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", userController.createUser);
router.post("/login", userController.logInUser);
router.post("/add-expense", userController.createExpense);
router.get("/get-expenses", userController.getAllExpenses);
router.delete("/delete-expense/:id", userController.deleteExpense);

module.exports = router;
