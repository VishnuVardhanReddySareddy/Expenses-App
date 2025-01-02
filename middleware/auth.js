const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("authorization");

    const userObj = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findByPk(userObj.UserId);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Error finding user" });
  }
};
