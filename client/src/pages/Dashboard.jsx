import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="dashboard">

      {/* NAVBAR */}
      <div className="navbar">
        <span>Home</span>
        <span>Profile</span>
        <span>Marks</span>
        <span>Notes</span>
      </div>

      {/* MAIN PROFILE SECTION */}
      <div className="profile-section">

        {/* LEFT */}
        <div className="left-panel">
          <div className="avatar"></div>
          <button className="edit-btn" onClick={() => navigate("/edit-profile")}>edit profile</button>
        </div>

        {/* CENTER */}
        <div className="center-panel">
          <div className="info red">Ranjith R</div>
          <div className="info red">21CS001</div>
          <div className="info red">ranjith@email.com</div>
        </div>

        {/* RIGHT */}
        <div className="right-panel">
          <button className="platform-btn">Leetcode</button>
          <button className="platform-btn">Atcoder</button>
          <button className="platform-btn">Codeforces</button>
          <button className="platform-btn">Github</button>
          <button className="resume-btn">Resume</button>
        </div>
      </div>

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

        <button className="add-course">add course</button>
      </div>

    </div>
  );
}
