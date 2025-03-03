// Import React and hooks
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/api-token-auth/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await response.json();
      localStorage.setItem("isAuthenticated", "true"); 
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("worker_id", username); 
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login_form">
      <h2 className="form-title">Welcome to Chrome Extension</h2>
      <div className="login-form-group">
        <label>Email</label>
        <input
          type="text"
          placeholder="Enter your email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="login-form-group">
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="login-btn">
        <button onClick={handleLogin} style={{ padding: "10px 20px", marginTop: "10px" }}>
          Login
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
