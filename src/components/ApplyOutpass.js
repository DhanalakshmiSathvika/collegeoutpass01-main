import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './ApplyOutpass.css';

export function ApplyOutpass() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    parentPhone: "",
    reason: "",
    returnTime: ""  // Changed from LeaveTime to returnTime to match API
  });

  // Get student email from localStorage
  const email = localStorage.getItem('userEmail');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if backend is reachable first
      const healthCheck = await fetch('http://localhost:5000/api/outpasses')
        .catch(() => null);
      
      if (!healthCheck) {
        throw new Error('Backend server is not running. Please start the backend server.');
      }

      const response = await fetch('http://localhost:5000/api/outpasses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentEmail: email,
          parentPhone: formData.parentPhone,
          reason: formData.reason,
          returnTime: formData.returnTime,
          status: 'pending',
          createdAt: new Date().toISOString()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit outpass');
      }

      // Success! Dispatch event and navigate
      window.dispatchEvent(new CustomEvent('outpassCreated', { 
        detail: data.outpass 
      }));

      alert("Outpass request submitted successfully!");
      navigate("/student/my-outpasses");

    } catch (error) {
      console.error('Submit Error:', error);
      const errorMessage = error.message.includes('Backend server') 
        ? error.message 
        : 'Failed to submit outpass. Please check if the backend server is running.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="apply-container">
        <div className="apply-card">
          <h2>Error</h2>
          <p>Please login first to apply for outpass.</p>
          <button 
            type="button" 
            className="btn-back-dash"
            onClick={() => navigate("/student")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="apply-container">
      <div className="apply-card">
        <h2>Apply for Outpass</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>College Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="disabled-input"
            />
          </div>

          <div className="form-group">
            <label>Parent's Phone Number</label>
            <input
              type="tel"
              name="parentPhone"
              placeholder="+91 9876543210"
              value={formData.parentPhone}
              onChange={handleChange}
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
              required
            />
          </div>

          <div className="form-group">
            <label>Reason for Leaving Campus</label>
            <textarea
              name="reason"
              placeholder="Enter reason..."
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Leaving Date & Time</label>
            <input
              type="datetime-local"
              name="returnTime"  // Changed to match state variable
              value={formData.returnTime}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
          <button 
            type="button" 
            className="btn-back-dash"
            onClick={() => navigate("/student/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
