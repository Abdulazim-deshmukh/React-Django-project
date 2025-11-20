// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const API_BASE = "http://localhost:8000/api";

// export default function OrderDetail() {
//   const { id } = useParams();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/orders/${id}/`, {
//           headers: { Authorization: `Token ${token}` },
//         });
//         const data = await res.json();
//         setOrder(data);
//       } catch (err) {
//         console.error("Error fetching order:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrder();
//   }, [id, token]);

//   if (loading) return <p>Loading order details...</p>;
//   if (!order) return <p>Order not found.</p>;

//   return (
//     <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", fontFamily: "Segoe UI, sans-serif" }}>
//       <button
//         onClick={() => navigate("/orders")}
//         style={{
//           background: "#1e88e5",
//           color: "#fff",
//           padding: "10px 20px",
//           border: "none",
//           borderRadius: "8px",
//           cursor: "pointer",
//           fontWeight: "bold",
//           marginBottom: "20px",
//         }}
//       >
//         ← Back to Orders
//       </button>

//       <h2>🧾 Order #{order.id}</h2>
//       <p><strong>Status:</strong> {order.status}</p>
//       <p><strong>Placed on:</strong> {new Date(order.created_at).toLocaleString()}</p>
//       <p><strong>Shipping Address:</strong> {order.address}</p>

//       <h3 style={{ marginTop: "25px" }}>Items</h3>
//       {order.items.map((item) => (
//         <div
//           key={item.id}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             borderBottom: "1px solid #eee",
//             padding: "10px 0",
//           }}
//         >
//           <img
//             src={item.product_image}
//             alt={item.product_name}
//             style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", marginRight: "15px" }}
//           />
//           <div>
//             <p style={{ fontWeight: "bold" }}>{item.product_name}</p>
//             <p>Qty: {item.quantity}</p>
//           </div>
//           <span style={{ marginLeft: "auto", fontWeight: "bold" }}>₹{item.price * item.quantity}</span>
//         </div>
//       ))}

//       <h3 style={{ textAlign: "right", marginTop: "20px" }}>
//         Total: ₹{order.total_price}
//       </h3>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000/api";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_BASE}/orders/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, token]);

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "40px", color: "#666" }}>
        Loading order details...
      </p>
    );

  if (!order)
    return (
      <p style={{ textAlign: "center", marginTop: "40px", color: "red" }}>
        Order not found.
      </p>
    );

  // Badge color logic
  const statusColors = {
    PENDING: "#f39c12",
    PROCESSING: "#2980b9",
    SHIPPED: "#8e44ad",
    DELIVERED: "#27ae60",
    CANCELLED: "#e74c3c",
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Order Card */}
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          padding: "25px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            marginBottom: "10px",
            color: "#333",
            borderBottom: "2px solid #ff9900",
            paddingBottom: "10px",
          }}
        >
          🧾 Order #{order.id}
        </h2>

        {/* Status Badge */}
        <div
          style={{
            display: "inline-block",
            padding: "6px 14px",
            borderRadius: "20px",
            backgroundColor: statusColors[order.status] || "#555",
            color: "#fff",
            fontWeight: "bold",
            marginBottom: "15px",
          }}
        >
          {order.status}
        </div>

        <p>
          <strong>📅 Placed on:</strong>{" "}
          {new Date(order.created_at).toLocaleString()}
        </p>
        <p>
          <strong>📍 Shipping Address:</strong> {order.address}
        </p>

        <h3 style={{ marginTop: "25px", borderTop: "2px solid #eee", paddingTop: "15px" }}>
          🛒 Items
        </h3>

        {/* Items List */}
        {order.items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: "1px solid #f0f0f0",
              gap: "15px",
            }}
          >
            <img
              src={item.product_image}
              alt={item.product_name}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "10px",
                boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                transition: "transform 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            />

            <div>
              <p style={{ fontWeight: "bold", fontSize: "15px" }}>
                {item.product_name}
              </p>
              <p style={{ color: "#555" }}>Qty: {item.quantity}</p>
            </div>

            <span
              style={{
                marginLeft: "auto",
                fontWeight: "bold",
                color: "#1e88e5",
              }}
            >
              ₹{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}

        {/* Total */}
        <h3
          style={{
            textAlign: "right",
            marginTop: "25px",
            fontSize: "22px",
            color: "#333",
          }}
        >
          Total:{" "}
          <span style={{ color: "#27ae60" }}>₹{order.total_price}</span>
        </h3>
      </div>

      {/* Back Button */}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button
          onClick={() => navigate("/orders")}
          style={{
            backgroundColor: "#333",
            color: "#fff",
            padding: "12px 25px",
            borderRadius: "8px",
            border: "none",
            fontWeight: "bold",
            fontSize: "15px",
            cursor: "pointer",
            transition: "0.2s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#111")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#333")}
        >
          ← Back to Orders
        </button>
      </div>
    </div>
  );
}
