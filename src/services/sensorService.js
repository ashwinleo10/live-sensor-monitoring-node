const db = require("../config/db");

const getSensors = async () => {
    const [rows] = await db.query(
        `SELECT
            sensor_id,
            MAX(timestamp) AS last_reading_time
        FROM sensor_readings
        GROUP BY sensor_id
        ORDER BY sensor_id`
    );

    const now = Date.now();

    const sensors = rows.map((sensor) => {
        const lastReadingTime = new Date(
            sensor.last_reading_time
        ).getTime();

        const secondsSinceLastReading =
            (now - lastReadingTime) / 1000;

        return {
            sensor_id: sensor.sensor_id,
            last_reading_time: sensor.last_reading_time,
            status: secondsSinceLastReading <= 10
                ? "ONLINE"
                : "OFFLINE"
        };
    });

    return sensors;
};

module.exports = {
    getSensors
};