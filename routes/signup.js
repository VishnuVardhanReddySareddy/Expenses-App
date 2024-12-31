const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", userController.createUser);
router.post("/login", userController.logInUser);
router.post("/add-expense", userController.createExpense);

module.exports = router;
