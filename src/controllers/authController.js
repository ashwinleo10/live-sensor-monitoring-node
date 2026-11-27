const authService = require("../services/authService");
const tokenBlacklistService = require("../services/tokenBlacklistService");
const sessionService = require("../services/sessionService");
const simulatorManager = require("../services/simulatorManager");

const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Basic password validation
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const user = await authService.registerUser(
            email,
            password
        );

        return res.status(201).json({
            message: "User registered successfully",
            user: user
        });

    } catch (error) {
        console.error(
            "Registration error:",
            error.message
        );

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Registration failed"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const result = await authService.loginUser(
            email,
            password
        );

        // Create active session for this login
        await sessionService.createSession(
            result.user.id,
            result.token
        );

        // Check how many users are currently active
        const activeSessionCount =
            await sessionService.getActiveSessionCount();

        console.log(
            `Active sessions after login: ${activeSessionCount}`
        );

        // Start one shared simulator when
        // the first active user logs in
        if (activeSessionCount === 1) {
            simulatorManager.startSimulator();
        }

        return res.status(200).json({
            message: "Login successful",
            token: result.token,
            user: result.user
        });

    } catch (error) {
        console.error(
            "Login error:",
            error.message
        );

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Login failed"
        });
    }
};

const logout = async (req, res) => {
    try {
        const token = req.token;

        // Blacklist JWT
        tokenBlacklistService.blacklistToken(
            token
        );

        // Remove this user's active session
        await sessionService.removeSession(
            token
        );

        // Check remaining active sessions
        const activeSessionCount =
            await sessionService.getActiveSessionCount();

        console.log(
            `Active sessions after logout: ${activeSessionCount}`
        );

        // Stop simulator only when
        // no active users remain
        if (activeSessionCount === 0) {
            simulatorManager.stopSimulator();
        }

        return res.status(200).json({
            message: "Logout successful"
        });

    } catch (error) {
        console.error(
            "Logout error:",
            error.message
        );

        return res.status(500).json({
            message: "Logout failed"
        });
    }
};

module.exports = {
    register,
    login,
    logout
};
