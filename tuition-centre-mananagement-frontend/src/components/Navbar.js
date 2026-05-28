import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Standard practice: Try to call the logout endpoint if authenticated
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch("http://localhost:8000/api/v1/auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
      } catch (err) {
        console.warn("Could not notify server about logout:", err);
      }
    }

    // Always clear the local storage token and redirect
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={styles.navbar}>
      <h2>Tuition Centre Management System</h2>

      <div style={styles.rightSection}>
        <span style={styles.userRole}>Admin</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    height: "70px",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    borderBottom: "1px solid #e2e8f0",
  },

  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  userRole: {
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "600",
  },

  logoutBtn: {
    padding: "6px 12px",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Navbar;