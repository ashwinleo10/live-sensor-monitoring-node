const express = require("express");
const cors = require("cors");

const db = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const readingRoutes = require("./src/routes/readingRoutes");
const sensorRoutes = require("./src/routes/sensorRoutes");
const alertRoutes = require("./src/routes/alertRoutes");

const authenticateToken = require("./src/middleware/authMiddleware");
const monitorService = require("./src/services/monitorService");

const app = express();

const PORT = process.env.PORT || 8080;

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://live-sensor-monitoring-node.vercel.app"
        ]
    })
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/readings", readingRoutes);
app.use("/sensors", sensorRoutes);
app.use("/alerts", alertRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Live Sensor Monitoring Node.js Backend is running"
    });
});

app.get("/db-test", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT 1 AS result"
        );

        res.json({
            message: "MySQL connection successful",
            result: rows[0].result
        });

    } catch (error) {
        console.error(
            "Database connection error:",
            error.message
        );

        res.status(500).json({
            message: "MySQL connection failed"
        });
    }
});

app.get(
    "/auth-test",
    authenticateToken,
    (req, res) => {
        res.json({
            message: "JWT authentication successful",
            user: req.user
        });
    }
);

app.listen(PORT, "0.0.0.0", () => {
    console.log(
        `Server running on port ${PORT}`
    );

    monitorService.startSensorMonitor();
});
