const express = require("express");
const sensorController = require("../controllers/sensorController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    authenticateToken,
    sensorController.getSensors
);

module.exports = router;