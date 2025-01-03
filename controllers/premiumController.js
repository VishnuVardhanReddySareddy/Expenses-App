const User = require("../models/user");
const Expense = require("../models/expense");

const sequelize = require("../config/db-config");

exports.showLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.findAll({
      attributes: [
        "id",
        "fullName",
        [
          sequelize.literal(
            "(SELECT SUM(price) FROM Expenses WHERE Expenses.userId = User.id)"
          ),
          "total_spent",
        ],
      ],
      order: [[sequelize.literal("total_spent"), "DESC"]],
      include: [
        {
          model: Expense,
          attributes: [],
        },
      ],
    });

    const formattedLeaderboard = leaderboard.map((user) => ({
      name: user.fullName,
      total_spent: user.get("total_spent"),
    }));

    res.status(200).json(formattedLeaderboard);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};
