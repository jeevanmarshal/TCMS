import MainLayout from "../layouts/MainLayout";

function Subjects() {
  return (
    <MainLayout>
      <div style={styles.container}>
        <h1 style={styles.heading}>
          Subject Registration
        </h1>

        <form style={styles.form}>
          <div style={styles.formGroup}>
            <label>Subject Name</label>

            <input
              type="text"
              placeholder="Enter subject name"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Subject Code</label>

            <input
              type="text"
              placeholder="Enter subject code"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Fee Amount</label>

            <input
              type="number"
              placeholder="Enter fee amount"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Duration</label>

            <input
              type="text"
              placeholder="Example: 6 Months"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Description</label>

            <textarea
              placeholder="Enter subject description"
              style={styles.textarea}
            />
          </div>

          <button style={styles.button}>
            Add Subject
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

export default Subjects;