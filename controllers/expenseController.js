const bcrypt = require("bcrypt");
const User = require("../models/user");
const Expense = require("../models/expense");

exports.createExpense = async (req, res) => {
  const { price, product, category } = req.body;
  const UserId = req.user.id;

  try {
    const expense = await Expense.create({
      price,
      product,
      category,
      UserId
    });

    const user = await User.findByPk(UserId);
    user.totalExpense += price;
    await user.save();
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: "Failed to add Expense" });
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { UserId: req.user.id } });
    const expensesData = expenses.map((expense) =>
      expense.get({ plain: true })
    );
    res.status(200).json(expensesData);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch expenses. Please try again." });
  }
};

exports.deleteExpense = async (req, res) => {
  const expenseId = req.params.id;

  try {
    const expense = await Expense.findByPk(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.UserId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this expense" });
    }
    await expense.destroy();
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the expense" });
  }
};
