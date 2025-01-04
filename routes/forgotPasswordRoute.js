const express = require("express");
const router = express.Router();

const resetPasswordController = require("../controllers/forgotPasswordController");

router.post("/forgotpassword", resetPasswordController.forgotPassword);
router.post("/updatepassword/:id", resetPasswordController.updatePassword);
router.get(
  "/resetpassword/:id",
  resetPasswordController.renderResetPasswordForm
);

module.exports = router;
