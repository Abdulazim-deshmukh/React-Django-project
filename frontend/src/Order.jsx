import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE}/orders/`, {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  if (loading) return <p>Loading your orders...</p>;
  if (orders.length === 0)
    return (
      <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Segoe UI, sans-serif" }}>
        <h3>No orders yet 😔</h3>
        <button
          onClick={() => navigate("/home")}
          style={{
            marginTop: "20px",
            backgroundColor: "#ff9900",
            color: "white",
            padding: "12px 25px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "15px",
          }}
        >
          🏠 Back to Home
        </button>
      </div>
    );

  const styles = {
    container: { maxWidth: "1000px", margin: "40px auto", padding: "20px", fontFamily: "Segoe UI, sans-serif" },
    orderCard: {
      border: "1px solid #e0e0e0",
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "25px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      backgroundColor: "#fff",
    },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
    orderId: { fontWeight: "600", fontSize: "16px", color: "#333" },
    date: { color: "#777", fontSize: "14px" },
    badge: (status) => ({
      padding: "5px 12px",
      borderRadius: "20px",
      color: "white",
      fontWeight: "bold",
      fontSize: "13px",
      backgroundColor:
        status === "pending" ? "#fbbf24" : status === "completed" ? "#22c55e" : "#ef4444",
    }),
    itemList: { marginTop: "15px", borderTop: "1px solid #f0f0f0", paddingTop: "15px" },
    item: { display: "flex", alignItems: "center", marginBottom: "15px" },
    image: {
      width: "70px",
      height: "70px",
      objectFit: "cover",
      borderRadius: "8px",
      marginRight: "15px",
      border: "1px solid #ddd",
    },
    name: { fontSize: "15px", fontWeight: "500", color: "#333" },
    price: { marginLeft: "auto", fontWeight: "600", color: "#222" },
    total: { textAlign: "right", fontWeight: "bold", marginTop: "10px", fontSize: "16px", color: "#000" },
    viewButton: {
      backgroundColor: "#1e88e5",
      color: "white",
      padding: "8px 16px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      marginTop: "10px",
      transition: "all 0.3s ease",
    },
    backButtonContainer: { textAlign: "center", marginTop: "40px" },
    backButton: {
      backgroundColor: "#ff9900",
      color: "white",
      padding: "14px 30px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "16px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      transition: "background-color 0.2s ease",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: "center", marginBottom: "25px" }}>🧾 Your Orders</h2>

      {orders.map((order) => (
        <div key={order.id} style={styles.orderCard}>
          <div style={styles.header}>
            <span style={styles.orderId}>Order #{order.id}</span>
            <span style={styles.badge(order.status)}>{order.status}</span>
          </div>
          <div style={styles.header}>
            <span style={styles.date}>Ordered on {new Date(order.created_at).toLocaleDateString()}</span>
            <span style={{ fontWeight: "bold" }}>Items: {order.items.length}</span>
          </div>

          <div style={styles.itemList}>
            {order.items.slice(0, 2).map((item) => (
              <div key={item.id} style={styles.item}>
                <img src={item.product_image} alt={item.product_name} style={styles.image} />
                <div>
                  <p style={styles.name}>{item.product_name}</p>
                  <p style={{ color: "#666" }}>Qty: {item.quantity}</p>
                </div>
                <span style={styles.price}>₹{item.price * item.quantity}</span>
              </div>
            ))}
            {order.items.length > 2 && (
              <p style={{ textAlign: "center", color: "#888" }}>+ more items...</p>
            )}
          </div>

          <div style={styles.total}>Total: ₹{order.total_price}</div>

          {/* ✅ View Details Button */}
          <button
            style={styles.viewButton}
            onClick={() => navigate(`/orders/${order.id}`)}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#1565c0")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#1e88e5")}
          >
            🔍 View Details
          </button>
        </div>
      ))}

      {/* ✅ Back to Home Button */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <button
          onClick={() => navigate("/home")}
          style={{
            backgroundColor: "#1e88e5",
            color: "white",
            padding: "12px 25px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "15px",
            width: "220px",
            transition: "0.2s",
          }}
        
        >
           Back to Home
        </button>
      </div>
    </div>
  );
}
