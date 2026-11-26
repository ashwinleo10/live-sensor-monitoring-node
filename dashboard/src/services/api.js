const API_BASE_URL = "http://localhost:8080";

const apiRequest = async (endpoint, options = {}) => {
    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(
            data.message || "API request failed"
        );

        error.statusCode = response.status;

        throw error;
    }

    return data;
};

const registerUser = async (email, password) => {
    return apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
            email,
            password
        })
    });
};

const loginUser = async (email, password) => {
    return apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
            email,
            password
        })
    });
};

const logoutUser = async (token) => {
    return apiRequest("/auth/logout", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const getLatestReadings = async (token) => {
    return apiRequest("/readings/latest", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const getSensors = async (token) => {
    return apiRequest("/sensors", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const getAlerts = async (token) => {
    return apiRequest("/alerts", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export {
    registerUser,
    loginUser,
    logoutUser,
    getLatestReadings,
    getSensors,
    getAlerts
};