const { v4: uuidv4 } = require("uuid");
const path = require("path");
const sibApiV3Sdk = require("sib-api-v3-sdk");
const User = require("../models/user");
const ForgotPasswordRequest = require("../models/forgotPasswordRequests");
const bcrypt = require("bcrypt");

exports.forgotPassword = async (req, res) => {
  const defaultClient = sibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

  const transactionalEmailsApi = new sibApiV3Sdk.TransactionalEmailsApi();
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const id = uuidv4();
    await ForgotPasswordRequest.create({
      id,
      UserId: user.id,
      isactive: true,
    });

    const resetUrl = `http://localhost:3000/password/resetpassword/${id}`;
    const emailContent = {
      sender: { email: "vishhureddy@gmail.com" },
      to: [{ email }],
      subject: "Password Reset Request",
      htmlContent: `
        <html>
          <body>
            <p>Hello,</p>
            <p>You have requested a password reset. Please click the link below to reset your password:</p>
            <p><a href="${resetUrl}">Reset Password</a></p>
          </body>
        </html>
      `,
    };

    await transactionalEmailsApi.sendTransacEmail(emailContent);
    console.log("Password reset email sent to:", email);
    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response ? error.response.body : error
    );
    res
      .status(500)
      .json({ message: "Failed to send email. Please try again later." });
  }
};

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
  console.log("Reset ID:", id);
  console.log("New Password:", password);

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
