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

  // Certification states
  const [certifications, setCertifications] = useState([]);
  const [showCertModal, setShowCertModal] = useState(false);
  const [certFile, setCertFile] = useState(null);
  const [certName, setCertName] = useState("");
  const [certOrg, setCertOrg] = useState("");
  const [uploadingCert, setUploadingCert] = useState(false);
  const [certError, setCertError] = useState("");
  const [certSuccess, setCertSuccess] = useState("");

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
    fetchCertifications(storedUser.id);
  }, [navigate]);

  const fetchCertifications = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/certifications/user/${userId}`);
      if (response.data.success) {
        setCertifications(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching certifications:", err);
    }
  };

  const handleCertFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
        setCertError('Only PDF and image files are allowed');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setCertError('File size must be less than 10MB');
        return;
      }
      setCertFile(file);
      setCertError('');
    }
  };

  const handleCertUpload = async (e) => {
    e.preventDefault();
    
    if (!certFile) {
      setCertError('Please select a file');
      return;
    }
    if (!certName.trim()) {
      setCertError('Please enter the certificate name');
      return;
    }
    if (!certOrg.trim()) {
      setCertError('Please enter the organization name');
      return;
    }

    try {
      setUploadingCert(true);
      setCertError('');
      setCertSuccess('');

      const formData = new FormData();
      formData.append('certificate', certFile);
      formData.append('name', certName.trim());
      formData.append('organization', certOrg.trim());
      formData.append('userId', user.id);

      await axios.post('http://localhost:5000/api/certifications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setCertSuccess('Certification uploaded successfully!');
      setCertFile(null);
      setCertName('');
      setCertOrg('');
      fetchCertifications(user.id);

      setTimeout(() => {
        setShowCertModal(false);
        setCertSuccess('');
      }, 1500);
    } catch (err) {
      console.error('Upload error:', err);
      setCertError(err.response?.data?.message || 'Failed to upload certification');
    } finally {
      setUploadingCert(false);
    }
  };

  const handleCertDownload = async (certId, certName) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/certifications/${certId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${certName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download certification');
    }
  };

  const handleCertDelete = async (certId) => {
    if (!window.confirm('Are you sure you want to delete this certification?')) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:5000/api/certifications/${certId}`);
      fetchCertifications(user.id);
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete certification');
    }
  };

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
        <h3>Certifications</h3>
        <div className="certificates-preview">
          {certifications.length === 0 ? (
            <div className="no-certs">No certifications added yet</div>
          ) : (
            certifications.map((cert, index) => (
              <div key={cert._id}>
                <div className="cert-item">
                  <div className="cert-info">
                    <span className="cert-name">{cert.name}</span>
                    <span className="cert-org">{cert.organization}</span>
                  </div>
                  <div className="cert-actions">
                    <button 
                      className="cert-download-btn"
                      onClick={() => handleCertDownload(cert._id, cert.name)}
                    >
                      ⬇️
                    </button>
                    <button 
                      className="cert-delete-btn"
                      onClick={() => handleCertDelete(cert._id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                {index < certifications.length - 1 && <hr className="cert-divider" />}
              </div>
            ))
          )}
        </div>

        <button className="add-course" onClick={() => setShowCertModal(true)}>
          Add Certification
        </button>
      </div>

      {/* Certification Upload Modal */}
      {showCertModal && (
        <div className="modal-overlay" onClick={() => setShowCertModal(false)}>
          <div className="cert-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Certification</h2>
              <button 
                className="close-btn"
                onClick={() => setShowCertModal(false)}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCertUpload}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Certificate Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., AWS Cloud Practitioner"
                    value={certName}
                    onChange={(e) => setCertName(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Issuing Organization *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Amazon Web Services"
                    value={certOrg}
                    onChange={(e) => setCertOrg(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Certificate File (PDF/Image) *</label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleCertFileChange}
                      id="cert-upload"
                    />
                    <label htmlFor="cert-upload" className="file-label">
                      {certFile ? certFile.name : 'Choose file (max 10MB)'}
                    </label>
                  </div>
                </div>

                {certError && (
                  <div className="error-message">{certError}</div>
                )}
                
                {certSuccess && (
                  <div className="success-message">{certSuccess}</div>
                )}
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowCertModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={uploadingCert}
                >
                  {uploadingCert ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}