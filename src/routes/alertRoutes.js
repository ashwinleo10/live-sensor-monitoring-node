const express = require("express");
const alertController = require("../controllers/alertController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    authenticateToken,
    alertController.getAlerts
);

module.exports = router;