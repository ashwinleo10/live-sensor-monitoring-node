const db = require("../config/db");

const createReading = async (
    readingId,
    sensorId,
    temperature,
    humidity
) => {
    // Check whether the reading already exists
    const [existingReadings] = await db.query(
        "SELECT id FROM sensor_readings WHERE reading_id = ?",
        [readingId]
    );

    if (existingReadings.length > 0) {
        const error = new Error("Duplicate reading_id");
        error.statusCode = 409;
        throw error;
    }

    // Insert the reading.
    // timestamp is assigned by MySQL using CURRENT_TIMESTAMP.
    const [result] = await db.query(
        `INSERT INTO sensor_readings
        (reading_id, sensor_id, temperature, humidity)
        VALUES (?, ?, ?, ?)`,
        [
            readingId,
            sensorId,
            temperature,
            humidity
        ]
    );

    return {
        id: result.insertId,
        reading_id: readingId,
        sensor_id: sensorId,
        temperature: temperature,
        humidity: humidity
    };
};

const getLatestReadings = async () => {
    const [rows] = await db.query(
        `SELECT
            reading_id,
            sensor_id,
            temperature,
            humidity,
            timestamp
        FROM sensor_readings sr
        WHERE timestamp = (
            SELECT MAX(sr2.timestamp)
            FROM sensor_readings sr2
            WHERE sr2.sensor_id = sr.sensor_id
        )
        ORDER BY sensor_id`
    );

    return rows;
};

const getReadingHistory = async (
    sensorId,
    startDate,
    endDate
) => {
    let query = `
        SELECT
            reading_id,
            sensor_id,
            temperature,
            humidity,
            timestamp
        FROM sensor_readings
        WHERE 1 = 1
    `;

    const params = [];

    // Filter by sensor ID if provided
    if (sensorId) {
        query += " AND sensor_id = ?";
        params.push(sensorId);
    }

    // Filter from start date if provided
    if (startDate) {
        query += " AND timestamp >= ?";
        params.push(`${startDate} 00:00:00`);
    }

    // Filter until the end date if provided
    if (endDate) {
        query += " AND timestamp <= ?";
        params.push(`${endDate} 23:59:59`);
    }

    query += " ORDER BY timestamp DESC";

    const [rows] = await db.query(query, params);

    return rows;
};

module.exports = {
    createReading,
    getLatestReadings,
    getReadingHistory
};