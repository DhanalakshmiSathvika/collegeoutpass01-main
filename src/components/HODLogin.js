import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function HODLogin({ setUser }) {
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

    // ✅ Validate institutional email
    if (!email.endsWith("@rcee.ac.in")) {
      setError("Please use your RCEE institutional email (@rcee.ac.in).");
      return;
    }

    // ✅ Email must contain 'HOD' for HOD account
    if (!email.toUpperCase().includes("HOD")) {
      setError("Email must contain 'HOD' for Head of Department access.");
      return;
    }

    // Successful Login
    console.log("HOD Login successful:", email);
    alert("Login successful! Welcome HOD, " + email);

    // Save login info
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", "hod");
    setUser({ email, role: "hod" });

    // Redirect to HOD Dashboard
    navigate("/hod/dashboard");
  };

  const goBack = () => {
    navigate("/");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", padding: "20px" }}>
      <h2>HOD Login - Head of Department</h2>

      <form
        onSubmit={handleLogin}
        style={{
          display: "inline-block",
          padding: "30px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#f0f8ff",
          maxWidth: "400px",
        }}
      >
        <div style={{ marginBottom: "15px" }}>
          <input
            type="email"
            placeholder="e.g., ai&dsHOD_@rcee.ac.in"
            value={email}
            onChange={handleEmailChange}
            style={{
              padding: "10px",
              width: "100%",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
            required
          />
          <small
            style={{
              display: "block",
              marginTop: "5px",
              color: "#666",
              fontSize: "12px",
            }}
          >
            Use your RCEE HOD email
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
              boxSizing: "border-box",
            }}
            required
          />
        </div>

        {error && (
          <div
            style={{
              color: "#d32f2f",
              marginBottom: "15px",
              fontSize: "14px",
              backgroundColor: "#ffebee",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ef9a9a",
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          style={{
            padding: "12px 30px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            width: "100%",
            fontWeight: "bold",
          }}
        >
          Login as HOD
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
            marginTop: "10px",
          }}
        >
          Back to Home
        </button>
      </form>
    </div>
  );
}
