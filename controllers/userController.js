const bcrypt = require("bcrypt");
const User = require("../models/user");
const Expense = require("../models/expense");

exports.createUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: "Email already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ ...req.body, password: hashedPassword });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

exports.logInUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) {
      return res.status(404).json({ error: "Email not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    res.status(200).json({ message: "Login successful", user: existingUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to log in" });
  }
};

exports.createExpense = async (req, res) => {
  const { price, product, category } = req.body;

  try {
    const expense = await Expense.create({ price, product, category });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: "Failed to add Expense" });
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll();
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
