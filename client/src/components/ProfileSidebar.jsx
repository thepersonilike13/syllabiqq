import { useNavigate } from "react-router-dom";

export default function ProfileSidebar({ active, setActive }) {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <p className="back" onClick={() => navigate("/dashboard")}>← Back to Profile</p>

      <ul>
        <li
          className={active === "basic" ? "active" : ""}
          onClick={() => setActive("basic")}
        >
          Profile Details
        </li>
        <li
          className={active === "platforms" ? "active" : ""}
          onClick={() => setActive("platforms")}
        >
          Platform
        </li>
      </ul>
    </div>
  );
}