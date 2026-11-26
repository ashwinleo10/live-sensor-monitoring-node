const alertService = require("./alertService");

const startSensorMonitor = () => {
    console.log("Sensor monitoring service started");

    setInterval(async () => {
        try {
            await alertService.checkDisconnectedSensors();
        } catch (error) {
            console.error(
                "Sensor monitoring error:",
                error.message
            );
        }
    }, 2000);
};

module.exports = {
    startSensorMonitor
};