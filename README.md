# 🍽️ RestroPulse: Enterprise Restaurant Analytics Platform

RestroPulse is a full-stack MERN (MongoDB, Express, React, Node.js) platform designed to transform raw restaurant transactional data into actionable business intelligence. Going beyond basic CRUD operations, this project utilizes complex MongoDB aggregation pipelines to deliver real-time analytics, securely guarded by a robust Role-Based Access Control (RBAC) system.



## 🔥 Key Engineering Features

* 📊 **Real-Time Data Aggregation:** Replaced static dummy data with dynamic MongoDB pipelines (`$match`, `$group`, `$project`) to instantly compute daily revenue, peak operational hours, and average order values across thousands of records.
* 🔐 **Bulletproof Security & RBAC:** Implemented JWT (JSON Web Tokens) with HTTP-Only cookies to eliminate XSS vulnerabilities. Features a strict 4-tier access system (`diner`, `cashier`, `manager`, `superadmin`) to protect sensitive analytics endpoints.
* 🏢 **Complex Relational Schema:** Designed scalable Mongoose architectures linking `Users`, `Transactions`, `Products`, and `Branches` for accurate, real-world data relationships.
* 📈 **Interactive Data Visualization:** Integrated `@nivo/charts` with Material UI (MUI) to render complex analytical JSON data into responsive, interactive charts with a seamless Dark/Light mode experience.
* 🧠 **Optimized State Management:** Utilized Redux Toolkit for efficient global state handling and API caching on the frontend.

## 🛠️ Tech Stack

* **Frontend:** React.js, Redux Toolkit, Material UI (MUI), Nivo Charts, React Router v6.
* **Backend:** Node.js, Express.js, JWT, Cookie-Parser.
* **Database:** MongoDB, Mongoose (with strict schema validation & aggregations).

## 📡 Core Analytics APIs

The backend exposes powerful analytical endpoints for the dashboard:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/analytics/daily-revenue` | GET | Aggregates transaction data by date to compute daily total revenue, order count, and AOV. |
| `/analytics/peak-hours` | GET | Groups completed transactions by the hour to identify the busiest times of the day. |
| `/auth/login` & `/auth/register` | POST | Handles user authentication and issues secure HTTP-Only cookies. |

## 🚀 Quick Start Guide

### 1. Installation
Clone the repository and install dependencies for both the client and server:
```bash
git clone [https://github.com/your-username/RestroPulse.git](https://github.com/your-username/RestroPulse.git)
cd RestroPulse

# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install