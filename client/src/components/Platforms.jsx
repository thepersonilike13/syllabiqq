import { useState } from "react";

export default function Platforms() {
  const [editMode, setEditMode] = useState({
    github: false,
    leetcode: false,
    codeforces: false,
    atcoder: false
  });

  const toggleEdit = (platform) => {
    setEditMode(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  return (
    <div>
      <h2>Platforms</h2>
      <p>Update your coding profiles and resume</p>

      <div className="card">
        <h3>Resume</h3>
        <div className="input-with-icon">
          <label>Upload Resume</label>
          <div className="input-container">
            <input 
              type="file" 
              accept=".pdf,.doc,.docx"
            />
          </div>
        </div>

        <h3 style={{marginTop: '30px'}}>Platform Links</h3>
        <div className="input-with-icon">
          <label>GitHub</label>
          <div className="input-container">
            <input 
              type="text" 
              defaultValue="https://github.com/ranjith" 
              disabled={!editMode.github}
            />
            <span 
              className="edit-icon" 
              onClick={() => toggleEdit('github')}
            >
              Edit
            </span>
          </div>
        </div>

        <div className="input-with-icon">
          <label>LeetCode</label>
          <div className="input-container">
            <input 
              type="text" 
              defaultValue="https://leetcode.com/u/ranjith" 
              disabled={!editMode.leetcode}
            />
            <span 
              className="edit-icon" 
              onClick={() => toggleEdit('leetcode')}
            >
              Edit
            </span>
          </div>
        </div>

        <div className="input-with-icon">
          <label>CodeForces</label>
          <div className="input-container">
            <input 
              type="text" 
              defaultValue="https://codeforces.com/profile/ranjith" 
              disabled={!editMode.codeforces}
            />
            <span 
              className="edit-icon" 
              onClick={() => toggleEdit('codeforces')}
            >
              Edit
            </span>
          </div>
        </div>

        <div className="input-with-icon">
          <label>AtCoder</label>
          <div className="input-container">
            <input 
              type="text" 
              defaultValue="https://atcoder.jp/users/ranjith" 
              disabled={!editMode.atcoder}
            />
            <span 
              className="edit-icon" 
              onClick={() => toggleEdit('atcoder')}
            >
              Edit
            </span>
          </div>
        </div>

        <button className="save">Save</button>
      </div>
    </div>
  );
}