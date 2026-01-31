import { useState } from "react";
import ProfileSidebar from "../components/ProfileSidebar";
import BasicInfo from "../components/BasicInfo";
import Education from "../components/Education";
import Platforms from "../components/Platforms";
import "../styles/editProfile.css";

export default function EditProfile() {
  const [active, setActive] = useState("basic");

  return (
    <div className="edit-profile">
      <ProfileSidebar active={active} setActive={setActive} />

      <div className="content">
        {active === "basic" && <BasicInfo />}
        {active === "platforms" && <Platforms />}
      </div>
    </div>
  );
}