import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setStoredUser, setToken } from "../utils/auth";
import "../styles/login.css";

export default function Login({ switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      const data = response.data;

      if (data.success) {
        setToken(data.token);
        setStoredUser(data.data.user);
        navigate("/profiledashboard");
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
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
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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