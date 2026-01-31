import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setStoredUser } from "../utils/auth";
import "../styles/login.css";

export default function Login({ switchToSignup }) {
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-image">
          <div className="placeholder-image">
            <span>🏢</span>
          </div>
        </div>

        <div className="login-form">
          <h2>SyllabIQ</h2>
          <p className="subtitle">Smart Learning Platform</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Register Number"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "LOG IN"}
            </button>
          </form>

          <p className="switch-link">
            Don't have an account?
            <span onClick={switchToSignup}> Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
}