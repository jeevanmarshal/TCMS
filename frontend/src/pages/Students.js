import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

function Students() {
  const navigate = useNavigate();

  // State Management
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [search, setSearch] = useState("");
  
  // Controls Edit vs Create modes
  const [editingId, setEditingId] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Page protection & Initial Data Load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchStudents();
  }, [search]); // Re-fetches students automatically when search input changes (Live Search!)

  // 1. GET (List / Search) Students API Call
  const fetchStudents = async () => {
    const token = localStorage.getItem("token");
    let url = "http://localhost:8000/api/v1/students/";
    
    if (search.trim()) {
      url += `?search=${encodeURIComponent(search)}`;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Token has expired or is invalid
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Could not fetch students");
      setStudents(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // 2. POST (Create) / PUT (Update) Student API Call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const token = localStorage.getItem("token");
    const studentData = {
      name,
      email,
      phone,
      address: address || null,
      gender,
      date_of_birth: dateOfBirth || null,
    };

    try {
      let response;
      if (editingId) {
        // Update Mode
        response = await fetch(`http://localhost:8000/api/v1/students/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(studentData),
        });
      } else {
        // Create Mode
        response = await fetch("http://localhost:8000/api/v1/students/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(studentData),
        });
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to save student profile");

      setSuccess(editingId ? "Student profile updated successfully!" : "Student registered successfully!");
      resetForm();
      fetchStudents();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. DELETE Student API Call
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this student record?")) return;
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8000/api/v1/students/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to delete student");

      setSuccess("Student record deleted successfully.");
      if (editingId === id) resetForm();
      fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  // Enables Edit Mode: populates form fields with selected student details
  const startEdit = (student) => {
    setEditingId(student.id);
    setName(student.name);
    setEmail(student.email);
    setPhone(student.phone);
    setAddress(student.address || "");
    setGender(student.gender);
    setDateOfBirth(student.date_of_birth || "");
    setError("");
    setSuccess("");
  };

  // Resets the inputs back to Creation Mode
  const resetForm = () => {
    setEditingId(null);
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setGender("");
    setDateOfBirth("");
  };

  return (
    <MainLayout>
      <div style={styles.pageGrid}>
        
        {/* LEFT COLUMN: ADD / EDIT STUDENT FORM */}
        <div style={styles.formContainer}>
          <h2 style={styles.sectionHeading}>
            {editingId ? "Edit Student Profile" : "Register New Student"}
          </h2>

          {error && <div style={styles.errorAlert}>{error}</div>}
          {success && <div style={styles.successAlert}>{success}</div>}

          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label>Student Name</label>
              <input
                type="text"
                placeholder="Enter student name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter student email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label>Phone Number</label>
              <input
                type="text"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label>Home Address</label>
              <textarea
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={styles.textarea}
              />
            </div>

            <div style={styles.formGroup}>
              <label>Gender</label>
              <select 
                value={gender} 
                onChange={(e) => setGender(e.target.value)}
                required
                style={styles.input}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label>Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.buttonRow}>
              <button 
                type="submit" 
                disabled={loading} 
                style={{
                  ...styles.submitBtn,
                  backgroundColor: editingId ? "#0f766e" : "#2563eb",
                  cursor: loading ? "not-allowed" : "pointer"
                }}
              >
                {loading ? "Saving..." : editingId ? "Update Student" : "Register Student"}
              </button>

              {editingId && (
                <button 
                  type="button" 
                  onClick={resetForm} 
                  style={styles.cancelBtn}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: REGISTERED STUDENTS LIST TABLE */}
        <div style={styles.listContainer}>
          <div style={styles.listHeader}>
            <h2 style={styles.sectionHeading}>Registered Students</h2>
            
            {/* SEARCH INPUT BAR */}
            <input
              type="text"
              placeholder="🔍 Search name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.tableWrapper}>
            {students.length === 0 ? (
              <p style={styles.noData}>No students found matching your criteria.</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableRowHeader}>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Phone</th>
                    <th style={styles.th}>Gender</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} style={styles.tr}>
                      <td style={styles.td}>{student.name}</td>
                      <td style={styles.td}>{student.email}</td>
                      <td style={styles.td}>{student.phone}</td>
                      <td style={styles.td}>{student.gender}</td>
                      <td style={styles.td}>
                        <div style={styles.actionContainer}>
                          <button 
                            onClick={() => startEdit(student)} 
                            style={styles.editBtn}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(student.id)} 
                            style={styles.deleteBtn}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </MainLayout>
  );
}

const styles = {
  pageGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "30px",
    alignItems: "start",
  },

  formContainer: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px -1px rgba(0,0,0,0.1)",
  },

  listContainer: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px -1px rgba(0,0,0,0.1)",
    minHeight: "450px",
  },

  sectionHeading: {
    color: "#1e293b",
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "20px",
  },

  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "15px",
  },

  searchInput: {
    padding: "8px 15px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    fontSize: "14px",
    width: "250px",
    outline: "none",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  input: {
    padding: "10px",
    border: "1px solid #cbd5e1",
    borderRadius: "5px",
    fontSize: "15px",
  },

  textarea: {
    padding: "10px",
    border: "1px solid #cbd5e1",
    borderRadius: "5px",
    fontSize: "15px",
    minHeight: "60px",
    resize: "none",
  },

  buttonRow: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

  submitBtn: {
    flex: 1,
    padding: "12px",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "15px",
    fontWeight: "600",
  },

  cancelBtn: {
    padding: "12px",
    backgroundColor: "#64748b",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },

  errorAlert: {
    padding: "10px 15px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fee2e2",
    color: "#b91c1c",
    borderRadius: "5px",
    fontSize: "14px",
    marginBottom: "15px",
  },

  successAlert: {
    padding: "10px 15px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #dcfce7",
    color: "#15803d",
    borderRadius: "5px",
    fontSize: "14px",
    marginBottom: "15px",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },

  tableRowHeader: {
    borderBottom: "2px solid #f1f5f9",
  },

  th: {
    padding: "12px",
    color: "#475569",
    fontWeight: "600",
    fontSize: "14px",
  },

  tr: {
    borderBottom: "1px solid #f1f5f9",
  },

  td: {
    padding: "12px",
    fontSize: "14px",
    color: "#334155",
  },

  actionContainer: {
    display: "flex",
    gap: "8px",
  },

  editBtn: {
    padding: "4px 8px",
    backgroundColor: "#f59e0b",
    color: "white",
    border: "none",
    borderRadius: "3px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },

  deleteBtn: {
    padding: "4px 8px",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "3px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },

  noData: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "15px",
    padding: "40px 0",
  },
};

export default Students;