# Live Sensor Monitoring Dashboard

A real-time sensor monitoring system built as a backend technical assessment.

The system receives sensor readings from a Node.js-based simulator, validates and stores the data in MySQL, monitors sensor connectivity, generates alerts for abnormal conditions, and displays live sensor information through a React dashboard.

---

## Features

- User registration and login
- Secure password hashing using bcrypt
- JWT-based authentication
- JWT-protected dashboard APIs
- Logout with JWT token blacklisting
- Sensor reading ingestion API
- Reading validation
- Duplicate reading prevention
- Automatic server-side timestamps
- Latest reading retrieval
- Sensor history with filtering
- Sensor ONLINE/OFFLINE detection
- High Temperature alerts
- High Humidity alerts
- Sensor Disconnected alerts
- Prevention of repeated alerts for the same ongoing condition
- Node.js sensor simulator
- Temporary sensor disconnection simulation
- React monitoring dashboard
- Automatic dashboard polling every 5 seconds
- Persistent data storage using MySQL
- Backend failure handling in the sensor simulator

---

## System Architecture

```text
                    ┌──────────────────────┐
                    │   Node.js Sensor     │
                    │      Simulator       │
                    │                      │
                    │    S1        S2      │
                    └──────────┬───────────┘
                               │
                               │ POST /readings
                               ▼
                    ┌──────────────────────┐
                    │    Node.js Backend   │
                    │      Express.js      │
                    │                      │
                    │ REST APIs             │
                    │ Validation            │
                    │ JWT Authentication    │
                    │ Alert Processing      │
                    │ Sensor Monitoring     │
                    └──────────┬───────────┘
                               │
                               │ MySQL Queries
                               ▼
                    ┌──────────────────────┐
                    │        MySQL          │
                    │    sensor_monitor     │
                    │                       │
                    │ users                 │
                    │ readings              │
                    │ alerts                │
                    └──────────┬───────────┘
                               │
                               │ Authenticated REST APIs
                               ▼
                    ┌──────────────────────┐
                    │    React Dashboard   │
                    │        Vite          │
                    │                      │
                    │ Sensor status         │
                    │ Temperature           │
                    │ Humidity              │
                    │ Alerts                │
                    │ Login / Register      │
                    │ Logout                │
                    └──────────────────────┘
```

The dashboard uses API polling for automatic updates. It requests the latest sensor information every 5 seconds.

---

# Technology Stack

## Backend

- Node.js
- Express.js
- MySQL
- mysql2
- bcrypt
- JWT
- dotenv
- CORS
- npm

## Sensor Simulator

- Node.js
- Axios
- JavaScript
- JSON

## Frontend

- React
- JavaScript
- Vite
- HTML
- CSS
- Fetch API

## Database

- MySQL 8.x

## Development Tools

- VS Code
- MySQL
- Postman
- Git
- GitHub
- npm

---

# Prerequisites

Install the following before running the project:

- Node.js 22.x or later
- npm
- MySQL 8.x
- Git

The project was developed and tested with:

```text
Node.js 22.x
npm 10.x
MySQL 8.x
```

Check the installed versions:

```bash
node -v
npm -v
mysql --version
```

---

# Database Setup

Create the database in MySQL:

```sql
CREATE DATABASE sensor_monitor;
```

Select the database:

```sql
USE sensor_monitor;
```

The application uses MySQL for persistent storage.

The main tables are:

```text
users
readings
alerts
```

---

## Users Table

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## Readings Table

```sql
CREATE TABLE readings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    reading_id VARCHAR(100) NOT NULL UNIQUE,
    sensor_id VARCHAR(50) NOT NULL,
    temperature DECIMAL(5,2) NOT NULL,
    humidity DECIMAL(5,2) NOT NULL,
    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## Alerts Table

```sql
CREATE TABLE alerts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    sensor_id VARCHAR(50) NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    message VARCHAR(255) NOT NULL,
    triggered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    resolved_at TIMESTAMP NULL
);
```

---

# Backend Setup

Navigate to the Node.js backend project:

```bash
cd live-sensor-monitoring-node
```

Install the backend dependencies:

```bash
npm install
```

---

# Environment Configuration

Create a local `.env` file in the project root.

Example:

```env
PORT=8080

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sensor_monitor

JWT_SECRET=your_jwt_secret
```

Configure the following values according to your local environment:

```text
DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_NAME
JWT_SECRET
```

These values must not be committed to GitHub.

The project includes `.env.example` as a configuration reference.

---

# Start the Backend

For normal execution:

```bash
npm start
```

For development:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:8080
```

You can verify the backend using:

```text
http://localhost:8080/
```

---

# Authentication

The application provides:

```text
POST /auth/register
POST /auth/login
POST /auth/logout
```

Passwords are never stored as plain text.

During registration, passwords are hashed using bcrypt before being stored in MySQL.

After successful login, the backend generates a JWT.

Protected APIs require:

```text
Authorization: Bearer <JWT>
```

Logout sends the JWT to the backend, where it is added to an in-memory token blacklist.

---

# Registration

Register a new user using:

```http
POST /auth/register
```

Request:

```json
{
    "email": "user@example.com",
    "password": "Password123"
}
```

A successful registration creates a user account with a securely hashed password.

---

# Login

Login using:

```http
POST /auth/login
```

Request:

```json
{
    "email": "user@example.com",
    "password": "Password123"
}
```

The response contains:

- JWT token
- User information

The dashboard stores the JWT and uses it for protected API requests.

---

# Logout

Logout using:

```http
POST /auth/logout
```

Header:

```text
Authorization: Bearer <JWT>
```

After logout, the token is rejected if it is used again.

---

# Sensor Simulator

The Node.js simulator generates readings for:

```text
S1
S2
```

A reading contains:

```json
{
    "reading_id": "unique-reading-id",
    "sensor_id": "S1",
    "temperature": 32.5,
    "humidity": 64.2
}
```

---

# Reading Ranges

Temperature:

```text
20°C - 40°C
```

Humidity:

```text
30% - 80%
```

A new reading is generated every 2 seconds.

---

# Running the Sensor Simulator

Navigate to the simulator:

```bash
cd simulator
```

Install dependencies:

```bash
npm install
```

Start the simulator:

```bash
node simulator.js
```

The simulator sends readings to:

```text
http://localhost:8080/readings
```

Example:

```text
[S1] Reading sent successfully
Temperature: 28.5°C
Humidity: 64.2%

[S2] Reading sent successfully
Temperature: 32.8°C
Humidity: 71.5%
```

---

# Temporary Sensor Disconnection

The simulator intentionally stops sending readings for S2 for a short period to demonstrate the sensor disconnection functionality.

Example:

```text
======================================
[S2] TEMPORARILY DISCONNECTED
[S2] No readings will be sent for 12 seconds
======================================
```

During the disconnection:

```text
[S2] Disconnected - reading not sent
```

After the configured period:

```text
======================================
[S2] RECONNECTED
[S2] Readings will resume
======================================
```

---

# Backend Unavailable Handling

If the backend becomes unavailable, the simulator catches the communication error and continues running instead of crashing.

Example:

```text
connect ECONNREFUSED ::1:8080
connect ECONNREFUSED 127.0.0.1:8080
```

The simulator continues running and resumes sending readings when the backend becomes available again.

---

# Sensor Monitoring

The backend monitors the last valid reading received from each sensor.

A sensor is considered:

```text
ONLINE
```

when readings are being received normally.

A sensor becomes:

```text
OFFLINE
```

when no valid reading is received for 10 seconds.

When readings resume, the sensor changes back to:

```text
ONLINE
```
---

# Dashboard

The React dashboard provides:

- Login
- User registration
- Logout
- Live sensor readings
- Temperature
- Humidity
- ONLINE/OFFLINE status
- Last reading time
- Active alerts
- Automatic updates

The dashboard polls the backend every:

```text
5 seconds
```

This was chosen instead of WebSockets because the assessment allows API polling for live updates.

---

# Running the Dashboard

Navigate to:

```bash
cd dashboard
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Vite development server will display the local URL in the terminal.

Usually:

```text
http://localhost:5173
```

Open that URL in the browser.

---

# Recommended Startup Order

Start the components in this order:

## 1. MySQL

Make sure MySQL is running and the database exists:

```text
sensor_monitor
```

---

## 2. Node.js Backend

Navigate to:

```text
live-sensor-monitoring-node
```

Start:

```bash
npm run dev
```

Verify:

```text
http://localhost:8080
```

---

## 3. Node.js Sensor Simulator

Navigate to:

```text
simulator
```

Start:

```bash
node simulator.js
```

The simulator begins sending readings every 2 seconds.

---

## 4. React Dashboard

Navigate to:

```text
dashboard
```

Start:

```bash
npm run dev
```

Open the dashboard and register/login using an account.

---

# Error Handling

The backend provides structured error responses for invalid requests and authentication failures.

Examples include:

- Missing required fields
- Invalid temperature range
- Invalid humidity range
- Duplicate reading ID
- Duplicate email
- Invalid credentials
- Invalid authentication token
- Unauthorized access
- Database errors
- Backend connection failures

The sensor simulator catches backend connection errors and continues running instead of terminating.

---

# Security

The project uses:

- bcrypt password hashing
- JWT authentication
- Protected dashboard APIs
- Authentication middleware
- Token blacklist for logout
- Environment variables for database password
- Environment variables for JWT secret
- `.env` excluded from Git
- `.env.example` for configuration reference
- Duplicate email prevention
- Duplicate reading prevention

Sensitive credentials are not stored in the source code.

