const User = require("../models/user");

exports.showLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.findAll({
      attributes: ["fullName", "totalExpense"],
      order: [["totalExpense", "DESC"]],
    });

    res.status(200).json(leaderboard);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong", error: err });
  }
};
