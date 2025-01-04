const sibApiV3Sdk = require("sib-api-v3-sdk");


exports.forgotPassword = async (req, res) => {
  const defaultClient = sibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

  const transactionalEmailsApi = new sibApiV3Sdk.TransactionalEmailsApi();

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  const sender = {
    email: "vishhureddy@gmail.com", // Your email address (to be linked in Sendinblue)
  };

  const receiver = [
    {
      email: email, // The email submitted in the form
    },
  ];

  const emailContent = {
    sender: sender,
    to: receiver,
    subject: "Password Reset Request",
    htmlContent: `
      <html>
        <body>
          <p>Hello,</p>
          <p>You have requested a password reset. Please click the link below to reset your password:</p>
          <p><a href="https://your-website.com/reset-password">Reset Password</a></p>
        </body>
      </html>
    `,
  };

  try {
    await transactionalEmailsApi.sendTransacEmail(emailContent);
    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ message: "Failed to send email. Please try again later." });
  }
};
