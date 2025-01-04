const bcrypt = require("bcrypt");
const User = require("../models/user");
const ForgotPasswordRequest = require("../models/ForgotPasswordRequest");
const path = require("node:path");

exports.renderResetPasswordForm = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await ForgotPasswordRequest.findOne({
      where: { id, isactive: true },
    });

    if (!request) {
      return res
        .status(400)
        .json({ message: "Invalid or expired password reset request." });
    }

    // Serve the reset-password.html file
    res.sendFile(path.join(__dirname, "../public/reset-password.html"));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

exports.updatePassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required." });
  }

  try {
    const request = await ForgotPasswordRequest.findOne({
      where: { id, isactive: true },
    });

    if (!request) {
      return res
        .status(400)
        .json({ message: "Invalid or expired password reset request." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.update(
      { password: hashedPassword },
      { where: { id: request.UserId } }
    );
    await ForgotPasswordRequest.update({ isactive: false }, { where: { id } });

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update password. Please try again later." });
  }
};
