import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000/api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      // ✅ Save token to localStorage
      localStorage.setItem("token", data.token);
      setMessage("Welcome back!");
      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>🛍️ MiniShop</h1>
        <p style={styles.subtitle}>Login to continue shopping!</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}

        <p style={styles.footerText}>
          Don’t have an account?{" "}
          <Link to="/signup" style={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

// ✨ Simple inline styling for modern look
const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#fff",
    padding: "40px 50px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "350px",
  },
  logo: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#333",
  },
  title: {
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "6px",
    color: "#222",
  },
  subtitle: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    margin: "8px 0",
    padding: "12px 14px",
    fontSize: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "0.3s",
  },
  button: {
    background: "#1e88e5",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    marginTop: "10px",
    transition: "0.3s",
  },
  message: {
    marginTop: "10px",
    color: "#e53935",
    fontWeight: "500",
  },
  footerText: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#333",
  },
  link: {
    color: "#1e88e5",
    textDecoration: "none",
    fontWeight: "600",
  },
};
