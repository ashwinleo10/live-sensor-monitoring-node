const express = require("express");
const readingController = require("../controllers/readingController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Sensor simulator sends readings without user authentication
router.post("/", readingController.createReading);

// Dashboard data requires authentication
router.get(
    "/latest",
    authenticateToken,
    readingController.getLatestReadings
);

// Reading history requires authentication
router.get(
    "/history",
    authenticateToken,
    readingController.getReadingHistory
);

module.exports = router;