export default function BasicInfo() {
  return (
    <div>
      <h2>Profile Details</h2>
      <p>View your profile information.</p>

      <div className="card">
        <h3>Basic Information</h3>
        <label>First Name</label>
        <input type="text" defaultValue="Ranjith" disabled />

        <label>Last Name</label>
        <input type="text" defaultValue="R" disabled />

        <label>Email</label>
        <input type="email" disabled defaultValue="ranjith@email.com" />

        <label>Country</label>
        <select disabled>
          <option>India</option>
          <option>USA</option>
        </select>

        <h3 style={{marginTop: '30px'}}>Education</h3>
        <label>Degree</label>
        <select disabled>
          <option>Bachelor of Technology (BTech)</option>
        </select>

        <label>College</label>
        <input defaultValue="St Joseph College of Engineering" disabled />

        <label>CGPA</label>
        <input defaultValue="8.87" disabled />

        <div className="row">
          <div>
            <label>From</label>
            <input defaultValue="2023" disabled />
          </div>
          <div>
            <label>To</label>
            <input defaultValue="2027" disabled />
          </div>
        </div>
      </div>
    </div>
  );
}