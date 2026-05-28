import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <div style={styles.container}>
      <Sidebar />

      <div style={styles.main}>
        <Navbar />

        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
  },

  main: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    minHeight: "100vh",
  },

  content: {
    padding: "20px",
  },
};

export default MainLayout;