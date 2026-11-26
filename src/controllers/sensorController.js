const sensorService = require("../services/sensorService");

const getSensors = async (req, res) => {
    try {
        const sensors = await sensorService.getSensors();

        return res.status(200).json({
            sensors: sensors
        });

    } catch (error) {
        console.error("Sensor status error:", error.message);

        return res.status(500).json({
            message: "Failed to fetch sensor status"
        });
    }
};

module.exports = {
    getSensors
};