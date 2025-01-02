const express = require("express");
const purchaseController = require("../controllers/purchaseController");
const AuthUser = require("../middleware/auth");

const router = express.Router();

router.get(
  "/premiummembership",
  AuthUser.authenticateUser,
  purchaseController.purchasepremium
);
router.post(
  "/updatetransactionstatus",
  AuthUser.authenticateUser,
  purchaseController.updateTransactionStatus
);

module.exports = router;
