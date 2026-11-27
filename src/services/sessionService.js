const crypto = require("crypto");
const db = require("../config/db");

const SESSION_DURATION_MINUTES = 30;

const hashToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};

const createSession = async (userId, token) => {
    const tokenHash = hashToken(token);

    const expiresAt = new Date(
        Date.now() + SESSION_DURATION_MINUTES * 60 * 1000
    );

    await db.query(
        `
        INSERT INTO active_sessions
        (
            user_id,
            token_hash,
            expires_at,
            last_activity_at
        )
        VALUES (?, ?, ?, NOW())
        `,
        [
            userId,
            tokenHash,
            expiresAt
        ]
    );

    return {
        expiresAt
    };
};

const removeSession = async (token) => {
    const tokenHash = hashToken(token);

    await db.query(
        `
        DELETE FROM active_sessions
        WHERE token_hash = ?
        `,
        [tokenHash]
    );
};

const cleanupExpiredSessions = async () => {
    await db.query(
        `
        DELETE FROM active_sessions
        WHERE expires_at <= NOW()
        `
    );
};

const getActiveSessionCount = async () => {
    await cleanupExpiredSessions();

    const [rows] = await db.query(
        `
        SELECT COUNT(*) AS count
        FROM active_sessions
        WHERE expires_at > NOW()
        `
    );

    return Number(rows[0].count);
};

module.exports = {
    createSession,
    removeSession,
    cleanupExpiredSessions,
    getActiveSessionCount
};