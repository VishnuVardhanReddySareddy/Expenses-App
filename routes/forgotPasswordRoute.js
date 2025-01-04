const express = require("express");
const router = express.Router();
const forgotPasswordController = require("../controllers/forgotPasswordController");
const resetPasswordController = require("../controllers/resetPasswordController");

router.post("/forgotpassword", forgotPasswordController.forgotPassword);
router.get(
  "/resetpassword/:id",
  resetPasswordController.renderResetPasswordForm
);
router.post("/updatepassword/:id", resetPasswordController.updatePassword);

module.exports = router;
