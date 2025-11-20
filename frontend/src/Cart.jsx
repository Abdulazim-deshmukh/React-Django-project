
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const API_BASE = "http://localhost:8000/api";

// export default function Cart() {
//   const [cartItems, setCartItems] = useState([]);
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const fetchCart = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setMessage("⚠️ Please login to see your cart.");
//       return;
//     }

//     try {
//       const res = await fetch(`${API_BASE}/cart/`, {
//         headers: {
//           Authorization: `Token ${token}`,
//         },
//       });
//       const data = await res.json();
//       setCartItems(data);
//     } catch (err) {
//       console.error("Failed to fetch cart:", err);
//       setMessage("❌ Could not load cart.");
//     }
//   };

//   const removeItem = async (id) => {
//     const token = localStorage.getItem("token");
//     try {
//       const res = await fetch(`${API_BASE}/cart/${id}/`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Token ${token}`,
//         },
//       });
//       if (res.ok) {
//         setCartItems(cartItems.filter((item) => item.id !== id));
//       }
//     } catch (err) {
//       console.error("Error removing item:", err);
//     }
//   };

//   const updateQuantity = async (id, newQty) => {
//     if (newQty < 1) return;
//     const token = localStorage.getItem("token");

//     try {
//       const res = await fetch(`${API_BASE}/cart/${id}/`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${token}`,
//         },
//         body: JSON.stringify({ quantity: newQty }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setCartItems(cartItems.map((item) => (item.id === id ? data : item)));
//       }
//     } catch (err) {
//       console.error("Error updating quantity:", err);
//     }
//   };

//   const total = cartItems.reduce(
//     (acc, item) => acc + item.product_price * item.quantity,
//     0
//   );

//   return (
//     <div
//       style={{
//         padding: "40px 20px",
//         fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//         background: "linear-gradient(135deg, #f9f9f9, #d0f0fd)",
//         minHeight: "100vh",
//       }}
//     >
//       <h2
//         style={{
//           textAlign: "center",
//           color: "#0d47a1",
//           fontSize: "2rem",
//           marginBottom: "25px",
//         }}
//       >
//         🛒 Your Shopping Cart
//       </h2>

//       <button
//   onClick={() => navigate("/checkout")}
//   style={{
//     background: "#1e88e5",
//     color: "#fff",
//     padding: "10px 15px",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     marginTop: "20px",
//   }}
// >
//   Proceed to Checkout →
// </button>


//       {/* Back to Home */}
//       <div style={{ textAlign: "center", marginBottom: "30px" }}>
//         <button
//           onClick={() => navigate("/home")}
//           style={{
//             background: "#ffb74d",
//             color: "#fff",
//             border: "none",
//             padding: "10px 20px",
//             borderRadius: "25px",
//             cursor: "pointer",
//             fontWeight: "bold",
//             boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
//             transition: "transform 0.2s, background 0.2s",
//           }}
//           onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
//           onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//         >
//           ← Back to Home
//         </button>
//       </div>

//       {message && (
//         <p style={{ color: "#d32f2f", textAlign: "center", fontWeight: "bold" }}>
//           {message}
//         </p>
//       )}

//       {cartItems.length === 0 ? (
//         <p
//           style={{
//             textAlign: "center",
//             color: "#555",
//             marginTop: "80px",
//             fontSize: "1.2rem",
//           }}
//         >
//           Your cart is empty. Add some amazing products! ✨
//         </p>
//       ) : (
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             gap: "20px",
//             maxWidth: "700px",
//             margin: "0 auto",
//           }}
//         >
//           {cartItems.map((item) => (
//             <div
//               key={item.id}
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 background: "#ffffff",
//                 padding: "20px",
//                 borderRadius: "15px",
//                 boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
//                 transition: "transform 0.2s, box-shadow 0.2s",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = "scale(1.02)";
//                 e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = "scale(1)";
//                 e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.1)";
//               }}
//             >
//               <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
//                 {item.product_image && (
//                   <img
//                     src={item.product_image}
//                     alt={item.product_name}
//                     style={{
//                       width: "70px",
//                       height: "70px",
//                       objectFit: "cover",
//                       borderRadius: "12px",
//                       border: "2px solid #90caf9",
//                     }}
//                   />
//                 )}
//                 <div>
//                   <p style={{ margin: 0, fontWeight: "bold", fontSize: "1rem" }}>
//                     {item.product_name}
//                   </p>
//                   <p style={{ margin: "5px 0", color: "#1976d2", fontWeight: "bold" }}>
//                     ₹{item.product_price}
//                   </p>

//                   {/* Quantity controls */}
//                   <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                     <button
//                       style={{
//                         padding: "5px 12px",
//                         background: "#29b6f6",
//                         color: "#fff",
//                         border: "none",
//                         borderRadius: "8px",
//                         cursor: "pointer",
//                         fontWeight: "bold",
//                       }}
//                       onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                     >
//                       -
//                     </button>
//                     <span style={{ minWidth: "25px", textAlign: "center", fontWeight: "bold" }}>
//                       {item.quantity}
//                     </span>
//                     <button
//                       style={{
//                         padding: "5px 12px",
//                         background: "#29b6f6",
//                         color: "#fff",
//                         border: "none",
//                         borderRadius: "8px",
//                         cursor: "pointer",
//                         fontWeight: "bold",
//                       }}
//                       onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               <button
//                 style={{
//                   background: "#e53935",
//                   color: "#fff",
//                   border: "none",
//                   padding: "10px 16px",
//                   borderRadius: "12px",
//                   cursor: "pointer",
//                   fontWeight: "bold",
//                   transition: "background 0.3s, transform 0.2s",
//                 }}
//                 onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
//                 onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//                 onClick={() => removeItem(item.id)}
//               >
//                 Remove
//               </button>
//             </div>
//           ))}

//           <h3
//             style={{
//               textAlign: "right",
//               marginTop: "25px",
//               color: "#0d47a1",
//               fontSize: "1.5rem",
//               fontWeight: "bold",
//             }}
//           >
//             Total: ₹{total}
//           </h3>

//           {/* Go back home button at the bottom */}
//           <div style={{ textAlign: "center", marginTop: "30px" }}>
//             <button
//               onClick={() => navigate("/home")}
//               style={{
//                 background: "#42a5f5",
//                 color: "#fff",
//                 border: "none",
//                 padding: "12px 25px",
//                 borderRadius: "30px",
//                 cursor: "pointer",
//                 fontWeight: "bold",
//                 fontSize: "1rem",
//                 boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
//                 transition: "transform 0.2s, background 0.2s",
//               }}
//               onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
//               onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//             >
//               Continue Shopping 🛍️
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000/api";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("⚠️ Please login to see your cart.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/cart/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await res.json();
      setCartItems(data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setMessage("❌ Could not load cart.");
    }
  };

  const removeItem = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/cart/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });

      if (res.ok) {
        setCartItems(cartItems.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const updateQuantity = async (id, newQty) => {
    if (newQty < 1) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/cart/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ quantity: newQty }),
      });

      const data = await res.json();
      if (res.ok) {
        setCartItems(
          cartItems.map((item) => (item.id === id ? data : item))
        );
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.product_price * item.quantity,
    0
  );

  return (
    <div
      style={{
        padding: "40px 20px",
        fontFamily: "Segoe UI, sans-serif",
        background: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <h2
        style={{
          textAlign: "center",
          fontSize: "2rem",
          marginBottom: "30px",
          color: "#1a237e",
          fontWeight: "700",
        }}
      >
        🛒 Shopping Cart
      </h2>

      {/* Back */}
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

      {message && (
        <p style={{ textAlign: "center", color: "#d32f2f", fontWeight: "600" }}>
          {message}
        </p>
      )}

      {/* Empty cart */}
      {cartItems.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            fontSize: "1.2rem",
            color: "#607d8b",
            marginTop: "80px",
          }}
        >
          Your cart is empty 🤷‍♂️
        </p>
      ) : (
        <>
          {/* Cart Items */}
          <div
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "#fff",
                  padding: "20px",
                  borderRadius: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ display: "flex", gap: "20px" }}>
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    style={{
                      width: "75px",
                      height: "75px",
                      borderRadius: "10px",
                      objectFit: "cover",
                      border: "1px solid #ddd",
                    }}
                  />

                  <div>
                    <p
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        marginBottom: "5px",
                      }}
                    >
                      {item.product_name}
                    </p>
                    <p
                      style={{
                        color: "#1565c0",
                        fontWeight: "700",
                        marginBottom: "10px",
                      }}
                    >
                      ₹{item.product_price}
                    </p>

                    {/* Quantity */}
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          background: "#e3f2fd",
                          border: "1px solid #90caf9",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        -
                      </button>

                      <span
                        style={{
                          minWidth: "30px",
                          textAlign: "center",
                          fontWeight: "700",
                        }}
                      >
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          background: "#e3f2fd",
                          border: "1px solid #90caf9",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    background: "#e53935",
                    color: "#fff",
                    border: "none",
                    padding: "10px 15px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Checkout Bar */}
          <div
            style={{
              maxWidth: "900px",
              margin: "40px auto 0",
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <h3 style={{ fontSize: "1.4rem", color: "#1a237e" }}>
              Total: <strong>₹{total}</strong>
            </h3>

            <button
              onClick={() => navigate("/checkout")}
              style={{
                marginTop: "15px",
                background: "#1e88e5",
                color: "#fff",
                padding: "12px 25px",
                border: "none",
                borderRadius: "30px",
                fontSize: "1rem",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Proceed to Checkout →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
