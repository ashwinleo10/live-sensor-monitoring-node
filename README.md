# Live Sensor Monitoring Dashboard

A full-stack real-time sensor monitoring system built as a backend technical assessment.

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

# Project Structure

```text
live-sensor-monitoring-node/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── readingRoutes.js
│   │   ├── sensorRoutes.js
│   │   └── alertRoutes.js
│   │
│   └── services/
│       └── monitorService.js
│
├── simulator/
│   ├── package.json
│   └── simulator.js
│
├── dashboard/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

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

# Alert Processing

The monitoring service generates alerts based on sensor conditions.

---

## High Temperature

Triggered when:

```text
Temperature > 35°C
```

Alert:

```text
High Temperature
```

---

## High Humidity

Triggered when:

```text
Humidity > 75%
```

Alert:

```text
High Humidity
```

---

## Sensor Disconnected

Triggered when:

```text
No valid reading for 10 seconds
```

Alert:

```text
Sensor Disconnected
```

---

The system prevents repeated alerts for the same ongoing condition.

For example, if a sensor remains above 35°C, the system does not create a new High Temperature alert on every monitoring cycle.

When the condition returns to normal, the active alert is resolved.

---

# Reading API

The simulator sends readings using:

```http
POST /readings
```

Example request:

```json
{
    "reading_id": "reading-001",
    "sensor_id": "S1",
    "temperature": 32.5,
    "humidity": 64.2
}
```

The backend validates the reading before storing it.

Validation includes:

- Required fields
- Temperature range
- Humidity range
- Duplicate reading ID prevention

The server/database generates the official reading timestamp.

---

# Reading History

The application supports retrieving historical sensor readings.

```http
GET /readings/history
```

Authentication is required.

The history API supports sensor and date filtering.

Example:

```text
GET /readings/history?sensor_id=S1
```

---

# Latest Readings

The application provides the latest reading for each sensor through:

```http
GET /readings/latest
```

Authentication is required.

The dashboard uses this information to display current sensor values.

---

# Sensor API

Get sensor status:

```http
GET /sensors
```

Authentication is required.

The API returns information such as:

```text
Sensor ID
Last Reading Time
ONLINE/OFFLINE Status
```

---

# Alert API

Get alerts:

```http
GET /alerts
```

Authentication is required.

The API returns alert information.

The dashboard displays only currently active alerts.

Resolved historical alerts are not displayed as current dashboard alerts.

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

# Dashboard Authentication Flow

```text
Register
    │
    ▼
Create Account
    │
    ▼
Login
    │
    ▼
JWT Token
    │
    ▼
Authenticated Dashboard
    │
    ├── Latest Readings
    ├── Sensor Status
    └── Active Alerts
```

The dashboard requires authentication before accessing protected sensor data.

---

# API Endpoints

## Authentication

### Register

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

---

### Login

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

The response contains a JWT token.

---

### Logout

```http
POST /auth/logout
```

Header:

```text
Authorization: Bearer <JWT>
```

---

## Sensor Readings

### Create Reading

```http
POST /readings
```

### Latest Readings

```http
GET /readings/latest
```

Authentication required.

### Reading History

```http
GET /readings/history
```

Authentication required.

Supports sensor/date filtering.

Example:

```text
GET /readings/history?sensor_id=S1
```

---

## Sensors

### Get Sensors

```http
GET /sensors
```

Authentication required.

Returns:

- Sensor ID
- Last reading time
- ONLINE/OFFLINE status

---

## Alerts

### Get Alerts

```http
GET /alerts
```

Authentication required.

Returns alert information.

---

# API Summary

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| POST | `/auth/register` | No | Register user |
| POST | `/auth/login` | No | Login |
| POST | `/auth/logout` | Yes | Logout |
| POST | `/readings` | No | Submit sensor reading |
| GET | `/readings/latest` | Yes | Get latest readings |
| GET | `/readings/history` | Yes | Get reading history |
| GET | `/sensors` | Yes | Get sensor status |
| GET | `/alerts` | Yes | Get alerts |

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

# Complete Data Flow

```text
                         ┌─────────────────┐
                         │ Sensor Simulator │
                         └────────┬────────┘
                                  │
                                  │ Every 2 seconds
                                  │
                                  ▼
                         POST /readings
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ Express Backend │
                         └────────┬────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
               Validation     Monitoring      Alerts
                    │             │             │
                    └─────────────┼─────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │      MySQL      │
                         └────────┬────────┘
                                  │
                                  │ Authenticated APIs
                                  ▼
                         ┌─────────────────┐
                         │ React Dashboard │
                         └─────────────────┘
```

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

---

# Technical Decisions

## API Polling

The dashboard uses polling every 5 seconds instead of WebSockets.

This keeps the implementation simple while satisfying the requirement for automatic live updates.

---

## Separate Sensor Simulator

The sensor simulator is maintained separately from the backend so sensor behavior can be tested independently.

---

## Server-Side Timestamp

The backend/database generates the official timestamp for sensor readings.

This prevents the simulator from controlling the stored event time.

---

## Alert Deduplication

The monitoring service prevents multiple active alerts for the same sensor and alert condition.

---

## Alert Resolution

Resolved alerts remain stored as historical records, but only active alerts are displayed on the dashboard.

---

## JWT Logout

Logout uses an in-memory token blacklist.

This means the blacklist is cleared when the Node.js server restarts.

For a production system, persistent token/session management such as Redis or database-backed sessions would be preferable.

---

# Testing

The following scenarios were tested.

## Authentication

- User registration
- Duplicate registration
- Valid login
- Invalid login
- Protected endpoint without token
- Protected endpoint with valid token
- Logout
- Reuse of logged-out token

---

## Sensor Readings

- Valid sensor reading
- Invalid temperature
- Invalid humidity
- Duplicate reading ID
- Latest readings
- Reading history
- Sensor filtering
- Date filtering
- Server-side timestamp

---

## Sensor Monitoring

- Sensor online
- Sensor offline after 10 seconds
- Sensor reconnection
- Multiple sensors

---

## Alerts

- High temperature
- High humidity
- Sensor disconnected
- Alert deduplication
- Alert resolution
- Multiple active conditions

---

## Simulator

- Normal sensor transmission
- Temporary S2 disconnection
- Backend unavailable
- Simulator continues during backend downtime
- Simulator recovery after backend restart

---

## Dashboard

- Login
- Registration
- Password mismatch validation
- Successful registration
- Dashboard login
- Sensor readings
- Sensor status
- Active alerts
- Resolved alerts hidden from current alerts
- Automatic 5-second updates
- Logout

---

# Manual Testing Flow

Start the system:

```text
1. Start MySQL
       ↓
2. Start Node.js backend
       ↓
3. Start sensor simulator
       ↓
4. Start React dashboard
       ↓
5. Register user
       ↓
6. Login
       ↓
7. Monitor S1 and S2
       ↓
8. Observe readings
       ↓
9. Observe alerts
       ↓
10. Test sensor disconnection
       ↓
11. Observe OFFLINE status
       ↓
12. Observe Sensor Disconnected alert
       ↓
13. Sensor reconnects
       ↓
14. Observe ONLINE status
```

---

# Troubleshooting

## Backend Does Not Start

Check Node.js:

```bash
node -v
```

Install dependencies again:

```bash
npm install
```

Check `.env` configuration.

---

## MySQL Connection Error

Verify:

```text
DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_NAME
```

Make sure MySQL is running.

Verify the database:

```sql
SHOW DATABASES;
```

Verify the tables:

```sql
USE sensor_monitor;
SHOW TABLES;
```

---

## Port 8080 Already in Use

Windows:

```bash
netstat -ano | findstr :8080
```

Stop the conflicting process or configure another port in `.env`.

---

## Dashboard Cannot Connect to Backend

Make sure the backend is running:

```text
http://localhost:8080
```

Check the API base URL in:

```text
dashboard/src/services/api.js
```

---

## Simulator Cannot Send Readings

Make sure the backend is running before starting the simulator.

If the backend is unavailable, the simulator should continue running and display connection errors instead of crashing.

---

## Login Not Working

Check:

1. Backend is running.
2. MySQL is running.
3. User exists in the database.
4. Email is correct.
5. Password is correct.
6. JWT secret is configured correctly.

---

## Alerts Not Appearing

Check:

1. Backend is running.
2. Simulator is running.
3. Sensor readings are being stored.
4. Temperature exceeds 35°C for High Temperature.
5. Humidity exceeds 75% for High Humidity.
6. Sensor stops sending readings for at least 10 seconds for Sensor Disconnected.

---

# GitHub Repository

[https://github.com/ashwinleo10/live-sensor-monitoring-node](https://github.com/ashwinleo10/live-sensor-monitoring-node)

---

# Git Commands

If the repository has already been initialized:

```bash
git status
```

Add changes:

```bash
git add .
```

Commit:

```bash
git commit -m "Complete Node.js sensor monitoring project"
```

Push:

```bash
git push origin main
```

---

# Git Security Check

Before pushing to GitHub, verify that `.env` is not included:

```bash
git status
```

The repository should contain:

```text
.env.example
```

but should not contain:

```text
.env
```

Never expose:

- Database passwords
- JWT secrets
- API keys
- Other private credentials

---

# Future Improvements

Possible future improvements include:

- WebSocket-based real-time updates
- Persistent JWT token management using Redis
- Refresh token authentication
- Role-based access control
- Historical temperature charts
- Historical humidity charts
- Sensor uptime statistics
- Email notifications
- Push notifications
- Docker containerization
- Automated unit tests
- Automated integration tests
- Cloud deployment
- Production monitoring

---

# Project Objective

The objective of this project is to demonstrate a complete live sensor monitoring solution using Node.js.

The system combines:

```text
Sensor Simulation
        ↓
REST API
        ↓
Authentication
        ↓
Validation
        ↓
MySQL Persistence
        ↓
Sensor Monitoring
        ↓
Alert Processing
        ↓
React Dashboard
        ↓
Automatic Updates
```

The project demonstrates practical implementation of:

- Node.js backend development
- Express.js REST APIs
- MySQL integration
- JWT authentication
- Password hashing
- Sensor data validation
- Sensor monitoring
- Alert generation
- Alert resolution
- Error handling
- React frontend development
- API integration
- Automatic dashboard updates
- Independent sensor simulation

---

# Conclusion

The Live Sensor Monitoring Dashboard provides a complete end-to-end implementation of a sensor monitoring system.

It combines an independent Node.js sensor simulator, Express.js backend, MySQL persistence, JWT authentication, automatic monitoring and alert detection, and a React dashboard.

The project is designed to be easy to run locally, test, demonstrate, and extend for production use.

---

# License

This project was developed for learning, technical assessment, and portfolio purposes.