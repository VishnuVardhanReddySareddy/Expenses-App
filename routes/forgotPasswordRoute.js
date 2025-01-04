const express = require("express");
const router = express.Router();

const resetPasswordController = require("../controllers/forgotPasswordController");

router.post("/password/forgotpassword", resetPasswordController.forgotPassword);

module.exports = router;
