const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const registerUser = async (email, password) => {
    // Check whether the email already exists
    const [existingUsers] = await db.query(
        "SELECT id FROM users WHERE email = ?",
        [email]
    );

    if (existingUsers.length > 0) {
        const error = new Error("Email already registered");
        error.statusCode = 409;
        throw error;
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user
    const [result] = await db.query(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword]
    );

    return {
        id: result.insertId,
        email: email
    };
};

const loginUser = async (email, password) => {
    // Find the user by email
    const [users] = await db.query(
        "SELECT id, email, password FROM users WHERE email = ?",
        [email]
    );

    if (users.length === 0) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const user = users[0];

    // Compare the entered password with the stored bcrypt hash
    const passwordMatches = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatches) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    // Generate JWT
    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    return {
        token: token,
        user: {
            id: user.id,
            email: user.email
        }
    };
};

module.exports = {
    registerUser,
    loginUser
};