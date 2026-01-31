import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getStoredUser, getRollNumber } from "../utils/auth";
import "../styles/dashboard.css";

export default function ProfileDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState({
    leetcode: "",
    codeforces: "",
    atcoder: "",
    github: ""
  });
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: ""
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const storedUser = getStoredUser();
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(storedUser);
    setUserInfo({
      name: storedUser.name || "",
      email: storedUser.email || ""
    });
    fetchUserLinks(storedUser.id);
  }, [navigate]);

  const fetchUserLinks = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/users/${userId}/links`);
      if (response.data.success) {
        const data = response.data.data;
        setLinks({
          leetcode: data.leetcode || "",
          codeforces: data.codeforces || "",
          atcoder: data.atcoder || "",
          github: data.github || ""
        });
      }
    } catch (err) {
      console.error("Error fetching links:", err);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkChange = (platform, value) => {
    setLinks(prev => ({ ...prev, [platform]: value }));
  };

  const handleUserInfoChange = (field, value) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // Update user info (name, email)
      const userResponse = await axios.put(`http://localhost:5000/api/users/${user.id}`, userInfo);
      
      // Update platform links
      const linksResponse = await axios.put(`http://localhost:5000/api/users/${user.id}/links`, links);
      
      if (userResponse.data.success && linksResponse.data.success) {
        // Update stored user data
        const updatedUser = { ...user, ...userInfo };
        setUser(updatedUser);
        localStorage.setItem('cp_user', JSON.stringify(updatedUser));
        
        setSuccess("Profile updated successfully!");
        setEditing(false);
      } else {
        setError(userResponse.data.message || linksResponse.data.message);
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(err.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="dashboard"><p>Loading...</p></div>;
  }

  return (
    <div className="dashboard">

      {/* NAVBAR */}
      <div className="navbar">
        <span onClick={() => navigate("/codedashboard")}>Home</span>
        <span onClick={() => navigate("/profiledashboard")}>Profile</span>
        <span>Marks</span>
        <span>Notes</span>
      </div>

      {/* MAIN PROFILE SECTION */}
      <div className="profile-section">

        {/* LEFT */}
        <div className="left-panel">
          <div className="avatar"></div>
          <button className="edit-btn" onClick={() => setEditing(!editing)}>
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* CENTER */}
        <div className="center-panel">
          {editing ? (
            <>
              <div className="info-field">
                <label className="info-label">NAME</label>
                <input
                  type="text"
                  className="info-input"
                  placeholder="Enter name"
                  value={userInfo.name}
                  onChange={(e) => handleUserInfoChange("name", e.target.value)}
                />
              </div>
              <div className="info-field">
                <label className="info-label">ROLL NUMBER</label>
                <div className="info">{user?.rollNumber || "Roll Number"}</div>
              </div>
              <div className="info-field">
                <label className="info-label">EMAIL</label>
                <input
                  type="email"
                  className="info-input"
                  placeholder="Enter email"
                  value={userInfo.email}
                  onChange={(e) => handleUserInfoChange("email", e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div className="info-field">
                <label className="info-label">NAME</label>
                <div className="info">{user?.name || "User Name"}</div>
              </div>
              <div className="info-field">
                <label className="info-label">ROLL NUMBER</label>
                <div className="info">{user?.rollNumber || "Roll Number"}</div>
              </div>
              <div className="info-field">
                <label className="info-label">EMAIL</label>
                <div className="info">{user?.email || "email@example.com"}</div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT */}
        <div className="right-panel">
          {editing ? (
            <>
              <div className="platform-field">
                <label className="platform-label">LEETCODE</label>
                <input
                  type="text"
                  className="platform-input"
                  placeholder="Enter username"
                  value={links.leetcode}
                  onChange={(e) => handleLinkChange("leetcode", e.target.value)}
                />
              </div>
              <div className="platform-field">
                <label className="platform-label">ATCODER</label>
                <input
                  type="text"
                  className="platform-input"
                  placeholder="Enter username"
                  value={links.atcoder}
                  onChange={(e) => handleLinkChange("atcoder", e.target.value)}
                />
              </div>
              <div className="platform-field">
                <label className="platform-label">CODEFORCES</label>
                <input
                  type="text"
                  className="platform-input"
                  placeholder="Enter username"
                  value={links.codeforces}
                  onChange={(e) => handleLinkChange("codeforces", e.target.value)}
                />
              </div>
              <div className="platform-field">
                <label className="platform-label">GITHUB</label>
                <input
                  type="text"
                  className="platform-input"
                  placeholder="Enter username"
                  value={links.github}
                  onChange={(e) => handleLinkChange("github", e.target.value)}
                />
              </div>
              <button className="save-btn" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <>
              <div 
                className="platform-btn" 
                onClick={() => links.leetcode && window.open(`https://leetcode.com/u/${links.leetcode}`, "_blank")}
              >
                <span className="platform-label">LEETCODE</span>
                <span className="platform-value">{links.leetcode || "Not set"}</span>
              </div>
              <div 
                className="platform-btn"
                onClick={() => links.atcoder && window.open(`https://atcoder.jp/users/${links.atcoder}`, "_blank")}
              >
                <span className="platform-label">ATCODER</span>
                <span className="platform-value">{links.atcoder || "Not set"}</span>
              </div>
              <div 
                className="platform-btn"
                onClick={() => links.codeforces && window.open(`https://codeforces.com/profile/${links.codeforces}`, "_blank")}
              >
                <span className="platform-label">CODEFORCES</span>
                <span className="platform-value">{links.codeforces || "Not set"}</span>
              </div>
              <div 
                className="platform-btn"
                onClick={() => links.github && window.open(`https://github.com/${links.github}`, "_blank")}
              >
                <span className="platform-label">GITHUB</span>
                <span className="platform-value">{links.github || "Not set"}</span>
              </div>
              <button className="resume-btn">RESUME</button>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* CERTIFICATES SECTION */}
      <div className="certificates-section">
        <h3>Certificates</h3>
        <div className="certificates-preview">
          <div className="cert-item">
            <span className="cert-name">AWS Cloud Practitioner</span>
            <span className="cert-org">Amazon Web Services</span>
          </div>
          <hr className="cert-divider" />
          <div className="cert-item">
            <span className="cert-name">React Developer Certificate</span>
            <span className="cert-org">Meta</span>
          </div>
          <hr className="cert-divider" />
          <div className="cert-item">
            <span className="cert-name">JavaScript Fundamentals</span>
            <span className="cert-org">FreeCodeCamp</span>
          </div>
          <hr className="cert-divider" />
          <div className="cert-item">
            <span className="cert-name">Data Structures & Algorithms</span>
            <span className="cert-org">Coursera</span>
          </div>
          <hr className="cert-divider" />
          <div className="cert-item">
            <span className="cert-name">Python Programming</span>
            <span className="cert-org">University of Michigan</span>
          </div>
          <hr className="cert-divider" />
          <div className="cert-item">
            <span className="cert-name">Machine Learning Basics</span>
            <span className="cert-org">Stanford University</span>
          </div>
          <hr className="cert-divider" />
          <div className="cert-item">
            <span className="cert-name">Database Management</span>
            <span className="cert-org">IBM</span>
          </div>
          <hr className="cert-divider" />
          <div className="cert-item">
            <span className="cert-name">Web Development</span>
            <span className="cert-org">The Odin Project</span>
          </div>
        </div>

        <button className="add-course">Add Course</button>
      </div>

    </div>
  );
}