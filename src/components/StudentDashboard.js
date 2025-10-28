import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './StudentDashboard.css';

export function StudentDashboard({ setUser }) {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>🎓 Student Dashboard</h1>
          <p className="user-email">{userEmail}</p>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome Back!</h2>
          <p>Manage your outpass requests from here</p>
        </div>

        <div className="action-cards">
          <div 
            className="action-card apply-card" 
            onClick={() => navigate("/student/apply-outpass")}
          >
            <h3>Apply for Outpass</h3>
            <div className="card-icon">📝</div>
            
            <p>Submit a new outpass request</p>
            <div className="card-arrow">→</div>
          </div>

          <div 
            className="action-card view-card" 
            onClick={() => navigate("/student/my-outpasses")}
          >
            <h3>My Outpasses</h3>
            <div className="card-icon">📋</div>
          
            <p>View and track your requests</p>
            <div className="card-arrow">→</div>
          </div>
        </div>

        <div className="info-section">
          <h3>Guidelines</h3>
          <ul>
            <li>✓ Wait for HOD approval before leaving</li>
            <li>✓ Show approved pass to security</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
