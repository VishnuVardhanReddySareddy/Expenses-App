const express = require("express");
const expenseController = require("../controllers/expenseController");
const AuthUser = require("../middleware/auth");

const router = express.Router();

router.post(
  "/add-expense",
  AuthUser.authenticateUser,
  expenseController.createExpense
);
router.get(
  "/get-expenses",
  AuthUser.authenticateUser,
  expenseController.getAllExpenses
);
router.delete(
  "/delete-expense/:id",
  AuthUser.authenticateUser,
  expenseController.deleteExpense
);

router.get("/download", AuthUser.authenticateUser, expenseController.download);

module.exports = router;
