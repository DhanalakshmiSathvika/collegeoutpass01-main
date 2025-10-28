# College Outpass Management System

A full web-based application built using **React.js** and **Node.js** to automate the process of student campus outpass requests, approval by HODs, and verification by security personnel.

----------------------------------------------------------------------------------------------------------------------------

## Overview

This system provides an online workflow for managing outpass requests in a college.
Students can apply for outpasses digitally, HODs can approve or reject them, and security guards can verify the final exit and re-entry status.

----------------------------------------------------------------------------------------------------------------------------

## Roles and Permissions

### Student

- Login using institutional email (`@rcee.ac.in`).
- Submit an outpass request including:
    - Parent contact number
    - Reason for leaving campus
    - Expected date and time of return
- Track status updates in real time (Pending, Approved, Rejected, Exited, Returned).

----------------------------------------------------------------------------------------------------------------------------

### Head of Department (HOD)

- Login using official HOD email credentials.
- View all pending student requests from the department.
- Approve or reject each request.
- Approved requests are automatically visible to the security team.

----------------------------------------------------------------------------------------------------------------------------

### Security Guard

- Login using official security guard credentials.
- View all **Approved** outpass requests.
- Update each record by marking:
    - “Exited Campus ✅” when the student leaves.
    - “Returned to Campus 🏫” when the student returns.
- Maintain a real-time record of student movement.

----------------------------------------------------------------------------------------------------------------------------

## Technology Stack

**Frontend:**
React.js, React Router, CSS

**Backend:**
Node.js, Express.js, MongoDB (Mongoose)

**Utilities and Tools:**
Axios, Cors, dotenv, Nodemon

----------------------------------------------------------------------------------------------------------------------------

## Folder Structure

```
CollegeOutpassSystem/
│
├── backend/
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── outpassController.js
│   ├── models/
│   │   └── Outpass.js
│   └── routes/
│       └── outpassRoutes.js
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── components/
│   │       ├── StudentLogin.js
│   │       ├── StudentDashboard.js
│   │       ├── HODLogin.js
│   │       ├── HODDashboard.js
│   │       ├── SecurityLogin.js
│   │       └── SecurityDashboard.js
│   ├── package.json
│
└── README.md
```


----------------------------------------------------------------------------------------------------------------------------

## Installation and Setup

### Step 1: Clone the Repository

```
git clone https://github.com/<your-username>/CollegeOutpassSystem.git
cd CollegeOutpassSystem
```


----------------------------------------------------------------------------------------------------------------------------

### Step 2: Backend Setup

```
cd backend
npm install
```

Create a `.env` file inside `/backend` and add your MongoDB key:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/outpass
PORT=5000
```

Start backend:

```
npm start
```


----------------------------------------------------------------------------------------------------------------------------

### Step 3: Frontend Setup

```
cd ../frontend
npm install
npm start
```

Frontend: `http://localhost:3000`
Backend: `http://localhost:5000`

----------------------------------------------------------------------------------------------------------------------------

## API Endpoints

| Method | Endpoint | Description | Role |
| :-- | :-- | :-- | :-- |
| POST | `/api/outpasses` | Create new outpass | Student |
| GET | `/api/outpasses` | Retrieve all requests | HOD / Security |
| PUT | `/api/outpasses/:id/status` | Approve or reject a request | HOD |
| PUT | `/api/outpasses/:id/exit` | Update exit/return status | Security |


----------------------------------------------------------------------------------------------------------------------------

## Sample Data

```javascript
const outpasses = [
  {
    id: 1,
    studentName: "Rohit Mehra",
    regNo: "21ME01",
    studentEmail: "21me01@rcee.ac.in",
    parentPhone: "+91 9876543210",
    reason: "Medical leave for doctor appointment",
    status: "Approved",
    approvedBy: "hod_me@rcee.ac.in",
    exitStatus: "Exited Campus ✅",
    returnTime: "2025-10-28T18:00"
  },
  {
    id: 2,
    studentName: "Sneha Reddy",
    regNo: "21CS12",
    studentEmail: "21cs12@rcee.ac.in",
    parentPhone: "+91 9876509876",
    reason: "Family event at home",
    status: "Returned",
    approvedBy: "hod_cs@rcee.ac.in",
    exitStatus: "Returned to Campus 🏫",
    returnTime: "2025-10-29T09:00"
  }
];
```


----------------------------------------------------------------------------------------------------------------------------

## Route Map

| User Role | Page | Route |
| :-- | :-- | :-- |
| Student | Login | `/student` |
| Student | Dashboard | `/student/dashboard` |
| HOD | Login | `/hod` |
| HOD | Dashboard | `/hod/dashboard` |
| Security | Login | `/security` |
| Security | Dashboard | `/security/dashboard` |


----------------------------------------------------------------------------------------------------------------------------

## Color Scheme

| Role | Color |
| :-- | :-- |
| Student | Blue (`#3b82f6`) |
| HOD | Red (`#f43f5e`) |
| Security | Orange (`#f59e0b`) |


----------------------------------------------------------------------------------------------------------------------------

## Developer

**Developed by:**
**Dhanalakshmi Sathvika**
**LinkedIn:** [linkedin.com/in/dhanalakshmi-sathvika-sannidhi-326922258](https://linkedin.com/in/dhanalakshmi-sathvika-sannidhi-326922258)
**GitHub:** [github.com/DhanalakshmiSathvika](https://github.com/DhanalakshmiSathvika)

----------------------------------------------------------------------------------------------------------------------------

## License

Licensed under the **MIT License**.
You may freely use and modify this codebase for personal or educational purposes with proper reference.

----------------------------------------------------------------------------------------------------------------------------

## Quick Start Summary

```
# Clone the repository
git clone https://github.com/<your-username>/CollegeOutpassSystem.git

# Backend setup
cd backend
npm install
npm start

# Frontend setup
cd ../frontend
npm install
npm start
```


----------------------------------------------------------------------------------------------------------------------------

**End**

----------------------------------------------------------------------------------------------------------------------------
