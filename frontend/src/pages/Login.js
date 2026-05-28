import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Standard OAuth2 password flow expects url-encoded form data (username & password)
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Retrieve error message from server response, or fallback
        throw new Error(data.detail || "Invalid login credentials. Please try again.");
      }

      // Securely store the JWT access token in the browser's local storage
      localStorage.setItem("token", data.access_token);

      // Redirect the authenticated user to the Dashboard page
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          Tuition Centre Management
        </h1>

        <p style={styles.subtitle}>
          Login to continue
        </p>

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        <form style={styles.form} onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },

  card: {
    width: "400px",
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
  },

  title: {
    textAlign: "center",
    marginBottom: "10px",
    color: "#1e293b",
  },

  subtitle: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#64748b",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  inputGroup: {
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

  button: {
    padding: "12px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    fontSize: "16px",
    borderRadius: "5px",
    cursor: "pointer",
  },

  errorBox: {
    padding: "12px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fee2e2",
    borderRadius: "5px",
    color: "#b91c1c",
    fontSize: "14px",
    textAlign: "center",
    marginBottom: "15px",
  },
};

export default Login;