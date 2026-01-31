import { useState } from "react";
import axios from "axios";
import "../styles/signup.css";

export default function Signup({ switchToLogin }) {
  const [rollNo, setRollNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!rollNo || !email || !password || !confirm) {
      setError("Please fill all fields");
      return;
    }
    
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name: rollNo, // Using rollNo as name for now
        email,
        password,
        rollNumber: rollNo
      });

      const data = response.data;

      if (data.success) {
        alert("Signup successful! Please login.");
        switchToLogin();
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || "Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-image">
          <div className="placeholder-image">
            <span>📚</span>
          </div>
        </div>

        <div className="signup-form">
          <h2>Join SyllabIQ</h2>
          <p className="subtitle">Create Your Learning Account</p>

          <form onSubmit={handleSignup}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Roll Number"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "CREATE ACCOUNT"}
            </button>
          </form>

          <p className="switch-link">
            Already have an account?
            <span onClick={switchToLogin}> Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}