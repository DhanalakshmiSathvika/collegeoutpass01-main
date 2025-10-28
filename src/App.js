import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'; // Added Link
import React, { useState, useEffect } from 'react';
import { StudentLogin } from './components/StudentLogin';  // Changed to named import
import { HODLogin } from './components/HODLogin';  // Changed to named import
import { SecurityLogin } from './components/SecurityLogin';  // Changed to named import
import { StudentDashboard } from './components/StudentDashboard';  // Changed to named import
import {ApplyOutpass}  from './components/ApplyOutpass';// Changed to named import
import { MyOutpasses } from './components/MyOutpasses';  // Changed to named import
import { HODDashboard } from './components/HODDashboard';  // Changed to named import
import { SecurityDashboard } from './components/SecurityDashboard';  // Changed to named import

function App() {
  const [user, setUser] = useState(() => {
    const savedEmail = localStorage.getItem('userEmail');
    const savedRole = localStorage.getItem('userRole');
    if (savedEmail && savedRole) {
      return { email: savedEmail, role: savedRole };
    }
    return null;
  });

  // persist user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userRole', user.role);
    } else {
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
    }
  }, [user]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<HomePage />} />

          {/* Login Routes */}
          <Route path="/student" element={<StudentLogin setUser={setUser} />} />
          <Route path="/hod" element={<HODLogin setUser={setUser} />} />
          <Route path="/security" element={<SecurityLogin setUser={setUser} />} />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              user && user.role === 'student' ? (
                <StudentDashboard />
              ) : (
                <Navigate to="/student" />
              )
            }
          />
          {/* ADD Apply route */}
          <Route
            path="/student/apply-outpass"
            element={
              user && user.role === 'student' ? (
                <ApplyOutpass />
              ) : (
                <Navigate to="/student" />
              )
            }
          />
          <Route
            path="/student/my-outpasses"
            element={
              user && user.role === 'student' ? (
                <MyOutpasses />
              ) : (
                <Navigate to="/student" />
              )
            }
          />

          {/* HOD Routes */}
          <Route
            path="/hod/dashboard"
            element={
              user && user.role === 'hod' ? (
                <HODDashboard />
              ) : (
                <Navigate to="/hod" />
              )
            }
          />

          {/* Security Routes */}
          <Route
            path="/security/dashboard"
            element={
              user && user.role === 'security' ? (
                <SecurityDashboard />
              ) : (
                <Navigate to="/security" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

function HomePage() {
  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">🎓 College Outpass Management System</h1>
        <p className="home-subtitle">
          Manage student campus exit permissions efficiently.
        </p>
      </div>

      <div className="role-selector">
        <Link to="/student" className="role-card student-role">
          <div className="role-icon">👨‍🎓</div>
          <h2 className="card-title">Student</h2>
          <p className="card-text">Apply for outpass and track requests</p>
        </Link>

        <Link to="/hod" className="role-card hod-role">
          <div className="role-icon">👔</div>
          <h2 className="card-title">HOD / Management</h2>
          <p className="card-text">Review and approve submissions</p>
        </Link>

        <Link to="/security" className="role-card security-role">
          <div className="role-icon">🛡️</div>
          <h2 className="card-title">Security</h2>
          <p className="card-text">Track approved outpasses and verify exits</p>
        </Link>
      </div>

      <footer className="home-footer">
        <p>
          Project developed by{' '}
          <a
            href="https://linkedin.com/in/dhanalakshmi-sathvika-sannidhi-326922258"
            target="_blank"
            rel="noreferrer"
            title="Dhanalakshmi Sathvika - LinkedIn"
          >
            <img
              src="/linkedin.png"
              alt="Dhanalakshmi Sathvika - LinkedIn"
              style={{ height: 28, verticalAlign: 'middle', borderRadius: 4 }}
            />
          </a>{' '}
          |{' '}
          <a
            href="https://github.com/DhanalakshmiSathvika"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/github.png"
              alt="Dhanalakshmi Sathvika - GitHub"
              style={{ height: 28, verticalAlign: 'middle', borderRadius: 4 }}
            />
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
