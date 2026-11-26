const db = require("../config/db");

const createAlertIfNotActive = async (
    sensorId,
    alertType,
    message
) => {
    // Check whether this alert is already active
    const [existingAlerts] = await db.query(
        `SELECT id
         FROM alerts
         WHERE sensor_id = ?
         AND alert_type = ?
         AND active = TRUE
         LIMIT 1`,
        [sensorId, alertType]
    );

    // Do not create another alert if the same
    // condition is already active
    if (existingAlerts.length > 0) {
        return null;
    }

    // Create a new alert
    const [result] = await db.query(
        `INSERT INTO alerts
        (sensor_id, alert_type, message)
        VALUES (?, ?, ?)`,
        [
            sensorId,
            alertType,
            message
        ]
    );

    return {
        id: result.insertId,
        sensor_id: sensorId,
        alert_type: alertType,
        message: message
    };
};

const resolveAlert = async (
    sensorId,
    alertType
) => {
    await db.query(
        `UPDATE alerts
         SET active = FALSE,
             resolved_at = CURRENT_TIMESTAMP
         WHERE sensor_id = ?
         AND alert_type = ?
         AND active = TRUE`,
        [
            sensorId,
            alertType
        ]
    );
};

const processReadingAlerts = async (
    sensorId,
    temperature,
    humidity
) => {
    // High Temperature
    if (temperature > 35) {
        await createAlertIfNotActive(
            sensorId,
            "HIGH_TEMPERATURE",
            "High Temperature"
        );
    } else {
        await resolveAlert(
            sensorId,
            "HIGH_TEMPERATURE"
        );
    }

    // High Humidity
    if (humidity > 75) {
        await createAlertIfNotActive(
            sensorId,
            "HIGH_HUMIDITY",
            "High Humidity"
        );
    } else {
        await resolveAlert(
            sensorId,
            "HIGH_HUMIDITY"
        );
    }

    // A valid reading means the sensor is connected again.
    // Resolve any active disconnected alert.
    await resolveAlert(
        sensorId,
        "SENSOR_DISCONNECTED"
    );
};

const checkDisconnectedSensors = async () => {
    // Find sensors whose latest reading is older than 10 seconds
    const [sensors] = await db.query(
        `SELECT
            sensor_id,
            MAX(timestamp) AS last_reading_time
         FROM sensor_readings
         GROUP BY sensor_id
         HAVING TIMESTAMPDIFF(
             SECOND,
             MAX(timestamp),
             CURRENT_TIMESTAMP
         ) > 10`
    );

    // Create a disconnected alert for each offline sensor
    for (const sensor of sensors) {
        await createAlertIfNotActive(
            sensor.sensor_id,
            "SENSOR_DISCONNECTED",
            "Sensor Disconnected"
        );
    }
};

module.exports = {
    createAlertIfNotActive,
    resolveAlert,
    processReadingAlerts,
    checkDisconnectedSensors
};