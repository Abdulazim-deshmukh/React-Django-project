// src/pages/Logout.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000/api/auth";

export default function Logout() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Logging you out... 🕒");

  useEffect(() => {
    async function handleLogout() {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("No session found. Redirecting...");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/logout/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        const data = await res.json();
        console.log("Logout:", data);

        // ✅ Clear token and show success
        localStorage.removeItem("token");
        setMessage(data.message || "You’ve been logged out successfully 🛍️");

        // Redirect to login after a short pause
        setTimeout(() => navigate("/login"), 2000);
      } catch (err) {
        console.error("Logout failed:", err);
        setMessage("Logout failed. Redirecting...");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 2000);
      }
    }

    handleLogout();
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>🛍️ MiniShop</h1>
        <h2 style={styles.title}>{message}</h2>
        <div className="spinner" style={styles.spinner}></div>
      </div>
    </div>
  );
}

// ✨ Styling for logout page
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
    fontSize: "18px",
    color: "#444",
    fontWeight: "500",
    marginTop: "10px",
  },
  spinner: {
    margin: "20px auto 0",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #1e88e5",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    animation: "spin 1s linear infinite",
  },
};

// Add global CSS for spinner animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(styleSheet);
