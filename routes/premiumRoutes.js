const express = require("express");
const router = express.Router();
const premiumController = require("../controllers/premiumController")

router.get("/showleaderboard", premiumController.showLeaderboard);

module.exports = router;
