const authService = require("../services/authService");
const tokenBlacklistService = require("../services/tokenBlacklistService");

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

        const user = await authService.registerUser(email, password);

        return res.status(201).json({
            message: "User registered successfully",
            user: user
        });

    } catch (error) {
        console.error("Registration error:", error.message);

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

        const result = await authService.loginUser(email, password);

        return res.status(200).json({
            message: "Login successful",
            token: result.token,
            user: result.user
        });

    } catch (error) {
        console.error("Login error:", error.message);

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

        tokenBlacklistService.blacklistToken(token);

        return res.status(200).json({
            message: "Logout successful"
        });

    } catch (error) {
        console.error("Logout error:", error.message);

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