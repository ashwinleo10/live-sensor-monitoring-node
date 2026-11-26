import { useEffect, useState } from "react";

import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";

import {
    getLatestReadings,
    getSensors,
    getAlerts,
    logoutUser
} from "./services/api";

function App() {
    const [user, setUser] = useState(null);

    const [showRegister, setShowRegister] =
        useState(false);

    const [readings, setReadings] = useState([]);
    const [sensors, setSensors] = useState([]);
    const [alerts, setAlerts] = useState([]);

    const [loading, setLoading] = useState(false);
    const [dashboardError, setDashboardError] =
        useState("");

    /*
     * Always start from Login when the frontend
     * is started or refreshed.
     */
    useEffect(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        setShowRegister(false);
    }, []);

    /*
     * Login successful
     */
    const handleLogin = (loggedInUser) => {
        setUser(loggedInUser);
        setShowRegister(false);
    };

    /*
     * Open Register page
     */
    const handleRegister = () => {
        setShowRegister(true);
    };

    /*
     * Registration successful
     * → return to Login page
     */
    const handleRegisterSuccess = () => {
        setShowRegister(false);
    };

    /*
     * Back to Login
     */
    const handleBackToLogin = () => {
        setShowRegister(false);
    };

    const handleLogout = async () => {
        const token =
            localStorage.getItem("token");

        try {
            if (token) {
                await logoutUser(token);
            }
        } catch (error) {
            console.error(
                "Logout request failed:",
                error.message
            );
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            setReadings([]);
            setSensors([]);
            setAlerts([]);
            setDashboardError("");

            setUser(null);
            setShowRegister(false);
        }
    };

    /*
     * Load dashboard data after login
     */
    useEffect(() => {
        if (!user) {
            return;
        }

        const token =
            localStorage.getItem("token");

        if (!token) {
            setUser(null);
            return;
        }

        const loadDashboardData = async () => {
            try {
                setLoading(true);
                setDashboardError("");

                const [
                    latestReadingData,
                    sensorData,
                    alertData
                ] = await Promise.all([
                    getLatestReadings(token),
                    getSensors(token),
                    getAlerts(token)
                ]);

                setReadings(
                    latestReadingData.readings ||
                    []
                );

                setSensors(
                    sensorData.sensors ||
                    []
                );

                /*
                 * Only show currently active alerts.
                 *
                 * Resolved alerts are historical records
                 * and should not appear on the dashboard.
                 *
                 * Also prevent duplicate active alerts
                 * for the same sensor + alert condition.
                 */
                const activeAlerts =
                    (alertData.alerts || [])
                        .filter(
                            (alert) =>
                                alert.active ===
                                    true ||
                                alert.active === 1
                        )
                        .filter(
                            (alert, index, array) => {

                                const alertType =
                                    alert.alert_type ||
                                    alert.message;

                                return (
                                    index ===
                                    array.findIndex(
                                        (item) => {

                                            const itemType =
                                                item.alert_type ||
                                                item.message;

                                            return (
                                                item.sensor_id ===
                                                    alert.sensor_id &&
                                                itemType ===
                                                    alertType
                                            );
                                        }
                                    )
                                );
                            }
                        );

                setAlerts(activeAlerts);

            } catch (error) {
                console.error(
                    "Dashboard data error:",
                    error.message
                );

                setDashboardError(
                    error.message ||
                    "Failed to load dashboard data"
                );

                if (
                    error.statusCode === 401
                ) {
                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "user"
                    );

                    setUser(null);
                }

            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();

        const interval = setInterval(
            loadDashboardData,
            5000
        );

        return () => {
            clearInterval(interval);
        };

    }, [user]);

    /*
     * Not logged in:
     *
     * show either Login or Register.
     */
    if (!user) {

        if (showRegister) {
            return (
                <Register
                    onRegisterSuccess={
                        handleRegisterSuccess
                    }
                    onBackToLogin={
                        handleBackToLogin
                    }
                />
            );
        }

        return (
            <Login
                onLogin={handleLogin}
                onRegister={handleRegister}
            />
        );
    }

    /*
     * Logged in → Dashboard
     */
    return (
        <div className="app">

            <header className="navbar">

                <div>

                    <h1>
                        Live Sensor Monitoring
                    </h1>

                    <p>
                        Real-time sensor dashboard
                    </p>

                </div>

                <div className="user-section">

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>

            <main className="dashboard">

                <section className="welcome-section">

                    <h2>
                        Sensor Overview
                    </h2>

                    <p>
                        Monitor temperature, humidity,
                        sensor status and alerts.
                    </p>

                </section>

                {dashboardError && (
                    <div className="dashboard-error">
                        {dashboardError}
                    </div>
                )}

                {loading &&
                    readings.length === 0 && (
                        <div className="loading-message">
                            Loading sensor data...
                        </div>
                    )}

                <section className="sensor-grid">

                    {sensors.map((sensor) => {

                        const reading =
                            readings.find(
                                (item) =>
                                    item.sensor_id ===
                                    sensor.sensor_id
                            );

                        return (
                            <div
                                className="sensor-card"
                                key={
                                    sensor.sensor_id
                                }
                            >

                                <div className="sensor-header">

                                    <div>

                                        <h3>
                                            {
                                                sensor.sensor_id
                                            }
                                        </h3>

                                        <span className="sensor-label">
                                            Sensor
                                        </span>

                                    </div>

                                    <span
                                        className={`status ${
                                            sensor.status ===
                                            "ONLINE"
                                                ? "online"
                                                : "offline"
                                        }`}
                                    >
                                        {
                                            sensor.status
                                        }
                                    </span>

                                </div>

                                <div className="sensor-values">

                                    <div>

                                        <span>
                                            Temperature
                                        </span>

                                        <strong>
                                            {reading
                                                ? `${Number(
                                                      reading.temperature
                                                  ).toFixed(
                                                      1
                                                  )} °C`
                                                : "-- °C"}
                                        </strong>

                                    </div>

                                    <div>

                                        <span>
                                            Humidity
                                        </span>

                                        <strong>
                                            {reading
                                                ? `${Number(
                                                      reading.humidity
                                                  ).toFixed(
                                                      1
                                                  )} %`
                                                : "-- %"}
                                        </strong>

                                    </div>

                                </div>

                                <p className="last-reading">

                                    Last reading:{" "}

                                    {sensor.last_reading_time
                                        ? new Date(
                                              sensor.last_reading_time
                                          ).toLocaleString()
                                        : "--"}

                                </p>

                            </div>
                        );
                    })}

                </section>

                <section className="alerts-section">

                    <div className="section-header">

                        <div>

                            <h2>
                                Alerts
                            </h2>

                            <p>
                                Current sensor conditions
                            </p>

                        </div>

                        {alerts.length > 0 && (
                            <span className="alert-count">
                                {alerts.length} active
                            </span>
                        )}

                    </div>

                    {alerts.length === 0 ? (

                        <div className="alert-card">

                            <div>

                                <strong>
                                    No alerts
                                </strong>

                                <p>
                                    No sensor alerts
                                    are currently active.
                                </p>

                            </div>

                        </div>

                    ) : (

                        <div className="alerts-list">

                            {alerts.map((alert) => (

                                <div
                                    className="alert-card active-alert"
                                    key={
                                        `${alert.sensor_id}-${alert.alert_type || alert.message}`
                                    }
                                >

                                    <div>

                                        <strong>
                                            {
                                                alert.message
                                            }
                                        </strong>

                                        <p>
                                            Sensor{" "}
                                            {
                                                alert.sensor_id
                                            }
                                            {" • "}
                                            {new Date(
                                                alert.triggered_at
                                            ).toLocaleString()}
                                        </p>

                                    </div>

                                    <span className="alert-status active">
                                        ACTIVE
                                    </span>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default App;
