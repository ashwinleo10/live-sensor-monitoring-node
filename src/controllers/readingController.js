const readingService = require("../services/readingService");
const alertService = require("../services/alertService");

const createReading = async (req, res) => {
    try {
        const {
            reading_id,
            sensor_id,
            temperature,
            humidity
        } = req.body;

        // Check required fields
        if (
            !reading_id ||
            !sensor_id ||
            temperature === undefined ||
            humidity === undefined
        ) {
            return res.status(400).json({
                message: "reading_id, sensor_id, temperature and humidity are required"
            });
        }

        // Validate numeric values
        if (
            typeof temperature !== "number" ||
            typeof humidity !== "number"
        ) {
            return res.status(400).json({
                message: "Temperature and humidity must be numbers"
            });
        }

        // Validate temperature range
        if (temperature < 20 || temperature > 40) {
            return res.status(400).json({
                message: "Temperature must be between 20 and 40°C"
            });
        }

        // Validate humidity range
        if (humidity < 30 || humidity > 80) {
            return res.status(400).json({
                message: "Humidity must be between 30 and 80%"
            });
        }

        // Store the valid reading
        const reading = await readingService.createReading(
            reading_id,
            sensor_id,
            temperature,
            humidity
        );

        // Check temperature and humidity alert conditions
        await alertService.processReadingAlerts(
            sensor_id,
            temperature,
            humidity
        );

        return res.status(201).json({
            message: "Reading stored successfully",
            reading: reading
        });

    } catch (error) {
        console.error("Reading creation error:", error.message);

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Failed to store reading"
        });
    }
};

const getLatestReadings = async (req, res) => {
    try {
        const readings = await readingService.getLatestReadings();

        return res.status(200).json({
            readings: readings
        });

    } catch (error) {
        console.error("Latest readings error:", error.message);

        return res.status(500).json({
            message: "Failed to fetch latest readings"
        });
    }
};

const getReadingHistory = async (req, res) => {
    try {
        const {
            sensor_id,
            start_date,
            end_date
        } = req.query;

        const readings = await readingService.getReadingHistory(
            sensor_id,
            start_date,
            end_date
        );

        return res.status(200).json({
            readings: readings
        });

    } catch (error) {
        console.error("Reading history error:", error.message);

        return res.status(500).json({
            message: "Failed to fetch reading history"
        });
    }
};

module.exports = {
    createReading,
    getLatestReadings,
    getReadingHistory
};