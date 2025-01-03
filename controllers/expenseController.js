const sequelize = require("../config/db-config");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Expense = require("../models/expense");

exports.createExpense = async (req, res) => {
  const { price, product, category } = req.body;
  const UserId = req.user.id;

  const transaction = await sequelize.transaction();
  try {
    const expense = await Expense.create(
      {
        price,
        product,
        category,
        UserId,
      },
      { transaction }
    );

    const user = await User.findByPk(UserId, { transaction });
    user.totalExpense += price;
    await user.save({ transaction });

    await transaction.commit(); // Commit the transaction
    res.json(expense);
  } catch (error) {
    await transaction.rollback(); // Rollback the transaction on error
    console.error(error);
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
  const transaction = await sequelize.transaction();

  try {
    const expense = await Expense.findByPk(expenseId, { transaction });
    if (!expense) {
      await transaction.rollback();
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.UserId !== req.user.id) {
      await transaction.rollback();
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this expense" });
    }

    const user = await User.findByPk(req.user.id, { transaction });
    user.totalExpense -= expense.price;
    await user.save({ transaction });

    await expense.destroy({ transaction });
    await transaction.commit();

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the expense" });
  }
};
