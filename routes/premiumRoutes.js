const express = require("express");
const router = express.Router();
const premiumController = require("../controllers/premiumController");
const AuthUser = require("../middleware/auth");

router.get(
  "/showleaderboard",
  AuthUser.authenticateUser,
  premiumController.showLeaderboard
);

module.exports = router;
