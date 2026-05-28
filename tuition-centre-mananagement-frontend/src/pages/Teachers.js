import MainLayout from "../layouts/MainLayout";

function Teachers() {
  return (
    <MainLayout>
      <div style={styles.container}>
        <h1 style={styles.heading}>
          Teacher Registration
        </h1>

        <form style={styles.form}>
          <div style={styles.formGroup}>
            <label>Teacher Name</label>

            <input
              type="text"
              placeholder="Enter teacher name"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter email"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Phone Number</label>

            <input
              type="text"
              placeholder="Enter phone number"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Address</label>

            <textarea
              placeholder="Enter address"
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Gender</label>

            <select style={styles.input}>
              <option>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label>Assigned Subject</label>

            <select style={styles.input}>
              <option>Select Subject</option>
              <option>Maths</option>
              <option>Physics</option>
              <option>Chemistry</option>
              <option>English</option>
            </select>
          </div>

          <button style={styles.button}>
            Add Teacher
          </button>
        </form>
      </div>
    </MainLayout>
  );
}

const styles = {
  container: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
  },

  heading: {
    marginBottom: "25px",
    color: "#1e293b",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  input: {
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "5px",
    fontSize: "16px",
  },

  textarea: {
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "5px",
    fontSize: "16px",
    minHeight: "100px",
    resize: "none",
  },

  button: {
    padding: "14px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Teachers;