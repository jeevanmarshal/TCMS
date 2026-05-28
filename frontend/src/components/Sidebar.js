import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <h2>TCMS</h2>

      <nav style={styles.nav}>
        <Link style={styles.link} to="/dashboard">
          Dashboard
        </Link>

        <Link style={styles.link} to="/students">
          Students
        </Link>

        <Link style={styles.link} to="/teachers">
          Teachers
        </Link>

        <Link style={styles.link} to="/subjects">
          Subjects
        </Link>
      </nav>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    height: "100vh",
    backgroundColor: "#1e293b",
    color: "white",
    padding: "20px",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    marginTop: "30px",
    gap: "15px",
  },

  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
  },
};

export default Sidebar;