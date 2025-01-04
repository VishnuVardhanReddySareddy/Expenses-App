const { v4: uuidv4 } = require("uuid");
const sibApiV3Sdk = require("sib-api-v3-sdk");
const User = require("../models/user");
const ForgotPasswordRequest = require("../models/ForgotPasswordRequest");

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
