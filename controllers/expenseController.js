const sequelize = require("../config/db-config");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Expense = require("../models/expense");
const AWS = require("aws-sdk");
require("dotenv").config();

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
  const page = parseInt(req.query._page, 10) || 1;
  const limit = parseInt(req.query._limit, 10) || 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await Expense.findAndCountAll({
      where: { UserId: req.user.id },
      limit,
      offset,
    });

    res.setHeader("x-total-count", count);
    res.status(200).json(rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch expenses. Please try again." });
  }
};

exports.download = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { UserId: req.user.id } });
    console.log(expenses);
    const stringifiedExpenses = JSON.stringify(
      expenses.map((expense) => expense.get({ plain: true }))
    );

    // it should depend upon the userid
    const userId = req.user.id;

    const filename = `Expenses/${userId}/${new Date()}.txt`;
    const fileUrl = await uploadToS3(stringifiedExpenses, filename);
    console.log(fileUrl);

    res.status(200).json({ fileUrl, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ fileUrl: "", success: false, err: err });
  }
};

function uploadToS3(data, filename) {
  const BUCKET_NAME = process.env.AWS_BUCKET;
  const IAM_USER_KEY = process.env.AWS_ACCESS_KEY_ID;
  const IAM_USER_SECRET = process.env.AWS_SECRET_ACCESS_KEY;

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("Something went wrong", err);
        reject(err);
      } else {
        console.log("success", s3response);
        resolve(s3response.Location);
      }
    });
  });
}

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
