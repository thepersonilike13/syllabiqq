export default function Education() {
  return (
    <div>
      <h2>Education</h2>
      <p>View your educational details.</p>

      <div className="card">
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