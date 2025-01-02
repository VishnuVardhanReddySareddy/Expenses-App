const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  const { fullName, email, password } = req.body;

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

    const token = jwt.sign({ UserId: existingUser.id }, process.env.SECRET_KEY);

    res.status(200).json({ message: "Login successful", token: token });
  } catch (error) {
    res.status(500).json({ error: "Failed to log in" });
  }
};
