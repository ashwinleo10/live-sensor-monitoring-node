const sessionService = require("./sessionService");
const simulatorManager = require("./simulatorManager");

let monitorInterval = null;

const CHECK_INTERVAL_MS = 10000; // 10 seconds

const checkActiveSessions = async () => {
    try {
        const activeSessionCount =
            await sessionService.getActiveSessionCount();

        console.log(
            `[Session Monitor] Active sessions: ${activeSessionCount}`
        );

        if (activeSessionCount === 0) {

            if (simulatorManager.isSimulatorRunning()) {
                console.log(
                    "[Session Monitor] No active users. Stopping simulator."
                );

                simulatorManager.stopSimulator();
            }

        } else {

            if (!simulatorManager.isSimulatorRunning()) {
                console.log(
                    "[Session Monitor] Active users found. Starting simulator."
                );

                simulatorManager.startSimulator();
            }
        }

    } catch (error) {
        console.error(
            "[Session Monitor] Check failed:",
            error.message
        );
    }
};

const startSessionMonitor = () => {

    if (monitorInterval) {
        console.log(
            "[Session Monitor] Already running."
        );

        return;
    }

    console.log(
        "[Session Monitor] Started. Checking every 10 seconds."
    );

    // Perform an immediate check
    checkActiveSessions();

    // Continue checking periodically
    monitorInterval = setInterval(() => {
        checkActiveSessions();
    }, CHECK_INTERVAL_MS);
};

const stopSessionMonitor = () => {

    if (!monitorInterval) {
        return;
    }

    clearInterval(monitorInterval);

    monitorInterval = null;

    console.log(
        "[Session Monitor] Stopped."
    );
};

module.exports = {
    startSessionMonitor,
    stopSessionMonitor
};
