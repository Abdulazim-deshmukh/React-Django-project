import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000/api/auth"; // your Django backend URL

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignup(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      setMessage("🎉 Signup successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>🛍️ MiniShop</h1>
        <h2 style={styles.title}>Create Your Account</h2>

        <form onSubmit={handleSignup} style={styles.form}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email Address"
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
            Sign Up
          </button>
        </form>

        <p style={styles.message}>{message}</p>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

// ✨ Inline Styles
const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Poppins', sans-serif",
  },
  card: {
    background: "#fff",
    padding: "40px 50px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    width: "350px",
    textAlign: "center",
  },
  logo: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#222",
    marginBottom: "5px",
  },
  title: {
    fontSize: "20px",
    color: "#333",
    marginBottom: "25px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    margin: "8px 0",
    border: "1px solid #ccc",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.2s ease",
  },
  button: {
    backgroundColor: "#1e88e5",
    color: "white",
    border: "none",
    padding: "10px 16px",
    marginTop: "10px",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
  },
  message: {
    color: "#444",
    marginTop: "15px",
    fontWeight: "500",
  },
  footerText: {
    marginTop: "20px",
    color: "#555",
    fontSize: "14px",
  },
  link: {
    color: "#1e88e5",
    textDecoration: "none",
    fontWeight: "600",
  },
};
