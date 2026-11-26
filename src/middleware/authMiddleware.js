const jwt = require("jsonwebtoken");
const tokenBlacklistService = require("../services/tokenBlacklistService");

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check whether Authorization header exists
        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization token is required"
            });
        }

        // Expected format:
        // Authorization: Bearer <token>
        const parts = authHeader.split(" ");

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({
                message: "Invalid authorization format"
            });
        }

        const token = parts[1];

        // Check whether token has been logged out
        if (tokenBlacklistService.isTokenBlacklisted(token)) {
            return res.status(401).json({
                message: "Token has been logged out"
            });
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store authenticated user information in request
        req.user = decoded;
        req.token = token;

        next();

    } catch (error) {
        console.error("Authentication error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authenticateToken;