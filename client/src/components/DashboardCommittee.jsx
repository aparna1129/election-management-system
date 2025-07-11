import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/DashboardCommittee.css";

function DashboardCommittee() {
  const [activeTab, setActiveTab] = useState("NagarParishad");
  const [candidates, setCandidates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    cand_fname: "",
    cand_lname: "",
    c_gender: "Male",
    c_dob: "",
    c_aadhar: "",
    c_email: "",
    c_contact: "",
    c_address: "",
    electionType: "NagarParishad",
  });
  const [toast, setToast] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    return new Date(diff).getUTCFullYear() - 1970;
  };

  useEffect(() => {
    fetchCandidates();
  }, [activeTab]);

  const fetchCandidates = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/candidates?electionType=${activeTab}`
      );
      const data = await res.json();
      setCandidates(data);
    } catch (err) {
      console.error("Error fetching candidates:", err);
      showToast("Failed to fetch candidates", "error");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Age validation
    const age = calculateAge(formData.c_dob);
    if (age < 18) {
      showToast("Candidates must be 18 years or older to register", "error");
      return;
    }
    
    try {
      const method = formData.id ? "PUT" : "POST";
      const url = formData.id
        ? `http://localhost:5000/api/candidates/${formData.id}`
        : "http://localhost:5000/api/candidates";

      let election_id = 1;
      if (activeTab === "Loksabha") election_id = 2;
      else if (activeTab === "Vidhansabha") election_id = 3;

      const payload = {
        cand_fname: formData.cand_fname,
        cand_lname: formData.cand_lname,
        c_gender: formData.c_gender,
        c_dob: formData.c_dob,
        c_aadhar: formData.c_aadhar,
        c_email: formData.c_email,
        c_contact: formData.c_contact,
        c_address: formData.c_address,
        election_id,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");
      showToast(formData.id ? "Candidate updated!" : "Candidate added!");
      setShowForm(false);
      setFormData({
        id: null,
        cand_fname: "",
        cand_lname: "",
        c_gender: "Male",
        c_dob: "",
        c_aadhar: "",
        c_email: "",
        c_contact: "",
        c_address: "",
        electionType: activeTab,
      });
      fetchCandidates();
    } catch (err) {
      console.error("Save error:", err);
      showToast("Failed to save candidate", "error");
    }
  };

  const handleEdit = (candidate) => {
    setFormData({
      id: candidate.cand_id,
      cand_fname: candidate.cand_fname,
      cand_lname: candidate.cand_lname,
      c_gender: candidate.c_gender,
      c_dob: candidate.c_dob,
      c_aadhar: candidate.c_aadhar,
      c_email: candidate.c_email,
      c_contact: candidate.c_contact,
      c_address: candidate.c_address,
      electionType: candidate.election_type,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/candidates/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      showToast("Candidate deleted");
      fetchCandidates();
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Delete failed", "error");
    }
  };

  return (
    <div className="dashboard-committee">
      {toast.message && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}

      <h2 className="dashboard-title">Elections:</h2>

      <div className="tabs">
        {["NagarParishad", "Loksabha", "Vidhansabha"].map((type) => (
          <button
            key={type}
            className={`tab-button ${activeTab === type ? "active" : ""}`}
            onClick={() => setActiveTab(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="candidate-section">
        <div className="candidate-header">
          <h3 className="candidate-title">{activeTab} Candidates</h3>
          <button
            className="add-candidate-button"
            onClick={() => setShowForm(true)}
          >
            + Add Candidate for {activeTab} Election
          </button>
        </div>

        <table className="candidate-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Gender</th>
              <th>DOB</th>
              <th>AadharID</th>
              <th>EmailID</th>
              <th>ContactNo</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c.cand_id} className="candidate-row">
                <td>{c.cand_id}</td>
                <td>
                  {c.cand_fname} {c.cand_lname}
                </td>
                <td>{c.c_gender}</td>
                <td>{c.c_dob}</td>
                <td>{c.c_aadhar}</td>
                <td>{c.c_email}</td>
                <td>{c.c_contact}</td>
                <td>{c.c_address}</td>
                <td>
                  <button className="edit-button" onClick={() => handleEdit(c)}>
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(c.cand_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
          <button className="check-result-btn" onClick={() => navigate(`/committee/result/${activeTab}`)}>
            Check result for {activeTab}
          </button>
        </div>

        {showForm && (
          <div className="modal-backdrop">
            <form className="modal" onSubmit={handleFormSubmit}>
              <h4 className="form-title">
                {formData.id ? "Edit" : "Add"} Candidate
              </h4>
              <input
                className="form-input"
                type="text"
                value={formData.cand_fname}
                onChange={e => setFormData({ ...formData, cand_fname: e.target.value })}
                placeholder="First Name"
                required
              />
              <input
                className="form-input"
                type="text"
                value={formData.cand_lname}
                onChange={e => setFormData({ ...formData, cand_lname: e.target.value })}
                placeholder="Last Name"
                required
              />
              <select
                className="form-input"
                value={formData.c_gender}
                onChange={e => setFormData({ ...formData, c_gender: e.target.value })}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              <input
                className="form-input"
                type="date"
                value={formData.c_dob}
                onChange={e => setFormData({ ...formData, c_dob: e.target.value })}
                placeholder="Date of Birth"
                required
              />
              <input
                className="form-input"
                type="text"
                value={formData.c_aadhar}
                onChange={e => setFormData({ ...formData, c_aadhar: e.target.value })}
                placeholder="Aadhar Number"
                maxLength={12}
                required
              />
              <input
                className="form-input"
                type="email"
                value={formData.c_email}
                onChange={e => setFormData({ ...formData, c_email: e.target.value })}
                placeholder="Email ID"
                required
              />
              <input
                className="form-input"
                type="text"
                value={formData.c_contact}
                onChange={e => setFormData({ ...formData, c_contact: e.target.value })}
                placeholder="Contact No."
                required
              />
              <input
                className="form-input"
                type="text"
                value={formData.c_address}
                onChange={e => setFormData({ ...formData, c_address: e.target.value })}
                placeholder="Address (e.g. City, State)"
                required
              />
              <div className="form-buttons">
                <button className="submit-button" type="submit">
                  {formData.id ? "Save Changes" : "Add Candidate"}
                </button>
                {formData.id && (
                  <button
                    className="delete-button"
                    type="button"
                    onClick={() => handleDelete(formData.id)}
                  >
                    Delete
                  </button>
                )}
                <button
                  className="cancel-button"
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      id: null,
                      cand_fname: "",
                      cand_lname: "",
                      c_gender: "Male",
                      c_dob: "",
                      c_aadhar: "",
                      c_email: "",
                      c_contact: "",
                      c_address: "",
                      electionType: activeTab,
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardCommittee;
