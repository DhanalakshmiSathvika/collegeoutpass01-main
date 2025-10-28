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

  async function handleSubmit(event) {
    event.preventDefault();

    // collect your state values here (replace names with yours)
    const payload = {
      name: email,
      phone: formData.parentPhone,
      reason: formData.reason,
      leavingDate: formData.returnTime,
    };

    try {
      const res = await fetch('/api/apply-outpass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Request failed');
      // success handling (navigate / show toast)
    } catch (err) {
      console.error('Submit error:', err);
      // show error to user
    }
  }

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
