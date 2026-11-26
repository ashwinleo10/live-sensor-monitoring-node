const db = require("../config/db");

const getAlerts = async (req, res) => {
    try {
        const [alerts] = await db.query(
            `SELECT
                id,
                sensor_id,
                alert_type,
                message,
                triggered_at,
                active,
                resolved_at
             FROM alerts
             ORDER BY triggered_at DESC`
        );

        return res.status(200).json({
            alerts: alerts
        });

    } catch (error) {
        console.error("Alerts fetch error:", error.message);

        return res.status(500).json({
            message: "Failed to fetch alerts"
        });
    }
};

module.exports = {
    getAlerts
};