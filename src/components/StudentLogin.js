import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function StudentLogin({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError("");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (!email.endsWith("@rcee.ac.in")) {
      setError("Please use your RCEE institutional email (@rcee.ac.in).");
      return;
    }

    if (!email.toUpperCase().includes("ME")) {
      setError("Email must contain 'ME' for student access.");
      return;
    }

    console.log("Login successful:", email);
  
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", "student");
    
    setUser({ email, role: 'student' });
    
    navigate("/student/dashboard");
  };

  const goBack = () => {
    navigate("/");
  };

  return (
    <div style={{ 
      textAlign: "center", 
      marginTop: "50px",
      padding: "20px"
    }}>
      <h2>Student Login</h2>
      
      <form onSubmit={handleLogin} style={{
        display: "inline-block",
        padding: "30px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f0f8ff",
        maxWidth: "400px"
      }}>
        
        <div style={{ marginBottom: "15px" }}>
          <input
            type="email"
            placeholder="e.g., 21ME_A__@rcee.ac.in"
            value={email}
            onChange={handleEmailChange}
            style={{ 
              padding: "10px", 
              width: "100%",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxSizing: "border-box"
            }}
            required
          />
          <small style={{ 
            display: "block", 
            marginTop: "5px", 
            color: "#666",
            fontSize: "12px"
          }}>
            Use your RCEE Student email
          </small>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
            style={{ 
              padding: "10px", 
              width: "100%",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxSizing: "border-box"
            }}
            required
          />
        </div>

        {error && (
          <div style={{ 
            color: "#d32f2f", 
            marginBottom: "15px",
            fontSize: "14px",
            backgroundColor: "#ffebee",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ef9a9a"
          }}>
            {error}
          </div>
        )}

        <button 
          type="submit"
          style={{ 
            padding: "12px 30px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            width: "100%",
            fontWeight: "bold"
          }}
        >
          Login as Student
        </button>

        <button 
          type="button"
          onClick={goBack}
          style={{ 
            padding: "12px 30px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            width: "100%",
            marginTop: "10px"
          }}
        >
          Back to Home
        </button>
      </form>
    </div>
  );
}
