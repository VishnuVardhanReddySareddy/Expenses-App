const User = require("../models/user");
const Expense = require("../models/expense");

const sequelize = require("../config/db-config");

exports.showLeaderboard = async (req, res) => {
  console.log("Vish");
  try {
    const leaderboard = await User.findAll({
      attributes: ["id", "fullName"],
      include: [
        {
          model: Expense,
          attributes: [
            [sequelize.fn("sum", sequelize.col("price")), "total_spent"],
          ],
          group: ["userId"],
        },
      ],
      order: [[sequelize.col("total_spent"), "DESC"]],
    });

    const formattedLeaderboard = leaderboard.map((user) => {
      return {
        name: user.fullName,
        total_spent: user.Expenses[0].dataValues.total_spent,
      };
    });

    res.status(200).json(formattedLeaderboard);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};
