import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

function Dashboard() {
  const navigate = useNavigate();

  // Basic Page protection check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, []);

  return (
    <MainLayout>
      <div>
        <h1 style={styles.heading}>
          Dashboard
        </h1>

        <div style={styles.cardContainer}>
          <div style={styles.card}>
            <h2>Total Students</h2>

            <p style={styles.number}>
              120
            </p>
          </div>

          <div style={styles.card}>
            <h2>Total Teachers</h2>

            <p style={styles.number}>
              5
            </p>
          </div>

          <div style={styles.card}>
            <h2>Total Subjects</h2>

            <p style={styles.number}>
              5
            </p>
          </div>

          <div style={styles.card}>
            <h2>Total Revenue</h2>

            <p style={styles.number}>
              ₹ 2,50,000
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

const styles = {
  heading: {
    marginBottom: "25px",
    color: "#1e293b",
  },

  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },

  card: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
  },

  number: {
    marginTop: "15px",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#2563eb",
  },
};

export default Dashboard;