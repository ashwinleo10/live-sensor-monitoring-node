const axios = require("axios");
const crypto = require("crypto");
require("dotenv").config();

const BACKEND_URL =
    process.env.BACKEND_URL ||
    "https://live-sensor-monitoring-node.onrender.com/readings";

const sensors = [
    {
        sensor_id: "S1",
        connected: true
    },
    {
        sensor_id: "S2",
        connected: true
    }
];

const generateTemperature = () => {
    return Number(
        (20 + Math.random() * 20).toFixed(2)
    );
};

const generateHumidity = () => {
    return Number(
        (30 + Math.random() * 50).toFixed(2)
    );
};

const generateReadingId = () => {
    return crypto.randomUUID();
};

const sendReading = async (sensor) => {
    if (!sensor.connected) {
        console.log(
            `[${sensor.sensor_id}] Disconnected - reading not sent`
        );

        return;
    }

    const reading = {
        reading_id: generateReadingId(),
        sensor_id: sensor.sensor_id,
        temperature: generateTemperature(),
        humidity: generateHumidity()
    };

    try {
        const response = await axios.post(
            BACKEND_URL,
            reading,
            {
                timeout: 3000
            }
        );

        console.log(
            `[${sensor.sensor_id}] Reading sent successfully`,
            response.data.reading
        );

    } catch (error) {

        if (error.response) {
            console.error(
                `[${sensor.sensor_id}] Backend rejected reading:`,
                error.response.data
            );

        } else {
            console.error(
                `[${sensor.sensor_id}] Backend unavailable:`,
                error.message
            );
        }
    }
};

const sendReadings = async () => {
    for (const sensor of sensors) {
        await sendReading(sensor);
    }
};

const startTemporaryDisconnection = () => {

    const s2 = sensors.find(
        (sensor) => sensor.sensor_id === "S2"
    );

    setInterval(() => {

        s2.connected = false;

        console.log("");
        console.log("======================================");
        console.log("[S2] TEMPORARILY DISCONNECTED");
        console.log("[S2] No readings will be sent for 12 seconds");
        console.log("======================================");

        setTimeout(() => {

            s2.connected = true;

            console.log("");
            console.log("======================================");
            console.log("[S2] RECONNECTED");
            console.log("[S2] Readings will resume");
            console.log("======================================");

        }, 12000);

    }, 30000);
};

const startSimulator = () => {

    console.log("======================================");
    console.log("Live Sensor Simulator Started");
    console.log(`Backend: ${BACKEND_URL}`);
    console.log("Interval: 2 seconds");
    console.log("Sensors: S1, S2");

    if (process.env.SIMULATOR_CONTROLLED === "true") {
        console.log("Mode: BACKEND CONTROLLED");
    } else {
        console.log("Mode: STANDALONE");
    }

    console.log("======================================");

    sendReadings();

    setInterval(() => {
        sendReadings();
    }, 2000);

    startTemporaryDisconnection();
};

startSimulator();