const { spawn } = require("child_process");
const path = require("path");

let simulatorProcess = null;

const startSimulator = () => {
    // Prevent multiple simulator processes
    if (simulatorProcess) {
        console.log(
            "Sensor simulator is already running."
        );

        return;
    }

    const simulatorPath = path.join(
        __dirname,
        "../../simulator/simulator.js"
    );

    console.log("");
    console.log("======================================");
    console.log("Starting sensor simulator...");
    console.log("======================================");

    simulatorProcess = spawn(
        process.execPath,
        [simulatorPath],
        {
            stdio: "inherit",

            env: {
                ...process.env,
                SIMULATOR_CONTROLLED: "true"
            }
        }
    );

    simulatorProcess.on(
        "error",
        (error) => {
            console.error(
                "Simulator process error:",
                error.message
            );

            simulatorProcess = null;
        }
    );

    simulatorProcess.on(
        "exit",
        (code, signal) => {
            console.log("");
            console.log(
                `Simulator stopped. code=${code}, signal=${signal}`
            );

            simulatorProcess = null;
        }
    );
};

const stopSimulator = () => {
    if (!simulatorProcess) {
        console.log(
            "Sensor simulator is not running."
        );

        return;
    }

    console.log("");
    console.log("======================================");
    console.log("Stopping sensor simulator...");
    console.log("======================================");

    simulatorProcess.kill("SIGTERM");

    simulatorProcess = null;
};

const isSimulatorRunning = () => {
    return simulatorProcess !== null;
};

module.exports = {
    startSimulator,
    stopSimulator,
    isSimulatorRunning
};
