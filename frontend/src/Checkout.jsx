
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import PaymentButton from "./PaymentButton";

// const API_BASE = "http://localhost:8000/api";

// export default function Checkout() {
//   const [cartItems, setCartItems] = useState([]);
//   const [address, setAddress] = useState("");
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("COD");
//   const [processing, setProcessing] = useState(false);
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   // Fetch cart items
//   useEffect(() => {
//     const fetchCart = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/cart/`, {
//           headers: { Authorization: `Token ${token}` },
//         });
//         const data = await res.json();
//         setCartItems(data);
//         setTotal(
//           data.reduce((sum, item) => sum + item.product_price * item.quantity, 0)
//         );
//       } catch (err) {
//         console.error("Error fetching cart:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCart();
//   }, [token]);

//   // Handle COD
//   const handleCODOrder = async () => {
//     if (!address.trim()) {
//       setMessage("⚠️ Please enter your delivery address!");
//       return;
//     }

//     setProcessing(true);
//     try {
//       const res = await fetch(`${API_BASE}/orders/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${token}`,
//         },
//         body: JSON.stringify({ address, payment_method: "COD" }),
//       });

//       if (!res.ok) throw new Error("COD Order failed");
//       setMessage("🎉 Order placed successfully!");
//       setTimeout(() => navigate("/orders"), 2000);
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Failed to place order");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   if (loading)
//     return (
//       <p style={{ textAlign: "center", marginTop: "40px", color: "#666" }}>
//         Loading checkout...
//       </p>
//     );

//   return (
//     <div style={{ maxWidth: "1100px", margin: "30px auto", padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#f7f8fa", minHeight: "100vh" }}>
//       <h2 style={{ fontSize: "28px", fontWeight: "bold", borderBottom: "2px solid #ff9900", paddingBottom: "10px", marginBottom: "20px", color: "#333" }}>
//         🧾 Checkout
//       </h2>

//       <button
//           onClick={() => navigate("/")}
//           style={{
//             backgroundColor: "#555",
//             color: "#fff",
//             border: "none",
//             borderRadius: "6px",
//             padding: "10px 18px",
//             fontSize: "14px",
//             cursor: "pointer",
//             transition: "background 0.2s",
//           }}
//           onMouseOver={(e) => (e.target.style.backgroundColor = "#333")}
//           onMouseOut={(e) => (e.target.style.backgroundColor = "#555")}
//         >
//           ⬅️ Back to Home
//         </button>

//       {message && (
//         <div style={{ backgroundColor: "#e6f4ea", color: "#2e7d32", padding: "10px", borderRadius: "6px", textAlign: "center", fontWeight: "bold", marginBottom: "20px" }}>
//           {message}
//         </div>
//       )}

//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
//         {/* Shipping & Payment */}
//         <div style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
//           <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "10px", color: "#333" }}>Shipping Address</h3>
//           <textarea
//             rows="4"
//             placeholder="Enter your full address"
//             value={address}
//             onChange={(e) => setAddress(e.target.value)}
//             style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "6px", resize: "none", fontSize: "14px" }}
//           />

//           <h3 style={{ fontSize: "20px", fontWeight: "600", marginTop: "25px", marginBottom: "10px", color: "#333" }}>Payment Method</h3>
//           <select
//             value={paymentMethod}
//             onChange={(e) => setPaymentMethod(e.target.value)}
//             style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px", marginTop: "5px" }}
//           >
//             <option value="COD">Cash on Delivery</option>
//             <option value="RAZORPAY">Credit/Debit/UPI</option>
//           </select>

//           {paymentMethod === "COD" && (
//             <button
//               onClick={handleCODOrder}
//               disabled={processing}
//               style={{ backgroundColor: "#ff9900", color: "#fff", width: "100%", padding: "14px", fontSize: "16px", fontWeight: "bold", border: "none", borderRadius: "8px", marginTop: "20px", cursor: "pointer" }}
//             >
//               {processing ? "Processing..." : "Place COD Order"}
//             </button>
//           )}
//         </div>

//         {/* Order Summary */}
//         <div style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
//           <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "10px", color: "#333" }}>Order Summary</h3>

//           {cartItems.map((item) => (
//             <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
//               <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//                 <img src={item.product_image} alt={item.product_name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }} />
//                 <div>
//                   <p style={{ fontWeight: "600", color: "#333" }}>{item.product_name}</p>
//                   <p style={{ fontSize: "13px", color: "#777" }}>Qty: {item.quantity} × ₹{item.product_price}</p>
//                 </div>
//               </div>
//               <p style={{ fontWeight: "bold", color: "#333" }}>₹{(item.product_price * item.quantity).toFixed(2)}</p>
//             </div>
//           ))}

//           <div style={{ fontSize: "18px", fontWeight: "bold", marginTop: "20px", display: "flex", justifyContent: "space-between", borderTop: "2px solid #eee', paddingTop: '10px", color: "#111" }}>
//             <span>Total:</span>
//             <span>₹{total.toFixed(2)}</span>
//           </div>

//           {paymentMethod === "RAZORPAY" && (
//             <PaymentButton total={total} address={address} token={token} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import PaymentButton from "./PaymentButton";

// const API_BASE = "http://localhost:8000/api";

// export default function Checkout() {
//   const [cartItems, setCartItems] = useState([]);
//   const [address, setAddress] = useState("");
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("COD");
//   const [processing, setProcessing] = useState(false);
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   // Fetch cart
//   useEffect(() => {
//     const fetchCart = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/cart/`, {
//           headers: { Authorization: `Token ${token}` },
//         });
//         const data = await res.json();
//         setCartItems(data);
//         setTotal(data.reduce((sum, item) => sum + item.product_price * item.quantity, 0));
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCart();
//   }, [token]);

//   // COD place order
//   const handleCODOrder = async () => {
//     if (!address.trim()) {
//       setMessage("⚠️ Please enter your delivery address!");
//       return;
//     }

//     setProcessing(true);

//     try {
//       const res = await fetch(`${API_BASE}/orders/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${token}`,
//         },
//         body: JSON.stringify({ address, payment_method: "COD" }),
//       });

//       if (!res.ok) throw new Error("Order failed");

//       setMessage("🎉 Order placed successfully!");
//       setTimeout(() => navigate("/orders"), 1800);
//     } catch (err) {
//       setMessage("❌ Failed to place order");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   if (loading)
//     return (
//       <p style={{ textAlign: "center", marginTop: "40px", color: "#666" }}>
//         Loading checkout...
//       </p>
//     );

//   return (
//     <div
//       style={{
//         maxWidth: "1100px",
//         margin: "30px auto",
//         padding: "20px",
//         fontFamily: "Arial, sans-serif",
//         minHeight: "100vh",
//         background: "#f5f7fa",
//       }}
//     >
//       <h2
//         style={{
//           fontSize: "30px",
//           fontWeight: "700",
//           color: "#1a237e",
//           marginBottom: "25px",
//         }}
//       >
//         Checkout
//       </h2>

//       {/* SUCCESS / ERROR MESSAGE */}
//       {message && (
//         <div
//           style={{
//             backgroundColor: "#e8f5e9",
//             color: "#2e7d32",
//             padding: "12px",
//             borderRadius: "8px",
//             textAlign: "center",
//             fontWeight: "600",
//             marginBottom: "20px",
//           }}
//         >
//           {message}
//         </div>
//       )}

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "1fr 1fr",
//           gap: "25px",
//         }}
//       >
//         {/* LEFT SIDE: SHIPPING + PAYMENT */}
//         <div
//           style={{
//             background: "#fff",
//             padding: "20px",
//             borderRadius: "12px",
//             boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//           }}
//         >
//           {/* SHIPPING */}
//           <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "10px" }}>
//             Shipping Address
//           </h3>
//           <textarea
//             rows="4"
//             value={address}
//             placeholder="Enter your complete delivery address"
//             onChange={(e) => setAddress(e.target.value)}
//             style={{
//               width: "100%",
//               padding: "12px",
//               fontSize: "14px",
//               borderRadius: "8px",
//               border: "1px solid #ccc",
//               resize: "none",
//             }}
//           />

//           {/* PAYMENT METHOD */}
//           <h3
//             style={{
//               fontSize: "20px",
//               fontWeight: "600",
//               marginTop: "25px",
//               marginBottom: "10px",
//             }}
//           >
//             Payment Method
//           </h3>
//           <select
//             value={paymentMethod}
//             onChange={(e) => setPaymentMethod(e.target.value)}
//             style={{
//               width: "100%",
//               padding: "12px",
//               borderRadius: "8px",
//               border: "1px solid #ccc",
//               fontSize: "14px",
//             }}
//           >
//             <option value="COD">Cash on Delivery</option>
//             <option value="RAZORPAY">Credit / Debit / UPI</option>
//           </select>

//           {/* COD BUTTON */}
//           {paymentMethod === "COD" && (
//             <button
//               onClick={handleCODOrder}
//               disabled={processing}
//               style={{
//                 marginTop: "25px",
//                 width: "100%",
//                 padding: "15px",
//                 backgroundColor: "#ff9800",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: "10px",
//                 fontSize: "16px",
//                 fontWeight: "700",
//                 cursor: "pointer",
//               }}
//             >
//               {processing ? "Placing Order..." : "Place COD Order"}
//             </button>
//           )}
//         </div>

//         {/* RIGHT SIDE: ORDER SUMMARY */}
//         <div
//           style={{
//             background: "#fff",
//             padding: "20px",
//             borderRadius: "12px",
//             boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//           }}
//         >
//           <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "15px" }}>
//             Order Summary
//           </h3>

//           {cartItems.map((item) => (
//             <div
//               key={item.id}
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 marginBottom: "15px",
//                 paddingBottom: "10px",
//                 borderBottom: "1px solid #eee",
//               }}
//             >
//               <div style={{ display: "flex", gap: "12px" }}>
//                 <img
//                   src={item.product_image}
//                   alt={item.product_name}
//                   style={{
//                     width: "65px",
//                     height: "65px",
//                     borderRadius: "8px",
//                     objectFit: "cover",
//                   }}
//                 />
//                 <div>
//                   <p style={{ fontWeight: "600" }}>{item.product_name}</p>
//                   <p style={{ fontSize: "13px", color: "#777" }}>
//                     Qty: {item.quantity} × ₹{item.product_price}
//                   </p>
//                 </div>
//               </div>
//               <p style={{ fontWeight: "700" }}>
//                 ₹{(item.product_price * item.quantity).toFixed(2)}
//               </p>
//             </div>
//           ))}

//           {/* TOTAL */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               fontSize: "18px",
//               fontWeight: "700",
//               marginTop: "15px",
//               borderTop: "2px solid #ddd",
//               paddingTop: "15px",
//             }}
//           >
//             <span>Total:</span>
//             <span>₹{total.toFixed(2)}</span>
//           </div>

//           {/* Razorpay Button */}
//           {paymentMethod === "RAZORPAY" && (
//             <PaymentButton total={total} address={address} token={token} />
//           )}
//         </div>
//       </div>

//       {/* BACK TO HOME — Bottom aligned */}
//       <div style={{ textAlign: "center", margin: "40px 0" }}>
//         <button
//           onClick={() => navigate("/home")}
//           style={{
//             backgroundColor: "#1e88e5",
//             color: "white",
//             padding: "12px 25px",
//             border: "none",
//             borderRadius: "8px",
//             cursor: "pointer",
//             fontWeight: "bold",
//             fontSize: "15px",
//           }}
//         >
//            Back to Home
//         </button>
//       </div>
//     </div>
//   );
// }




// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import PaymentButton from "./PaymentButton";

// const API_BASE = "http://localhost:8000/api";

// export default function Checkout() {
//   const [cartItems, setCartItems] = useState([]);
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [newAddress, setNewAddress] = useState({
//     full_name: "",
//     phone: "",
//     street: "",
//     city: "",
//     state: "",
//     postal_code: "",
//     country: "",
//   });
//   const [showForm, setShowForm] = useState(false);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("COD");
//   const [processing, setProcessing] = useState(false);

//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   /* ---------------- FETCH CART ---------------- */
//   useEffect(() => {
//     const fetchCart = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/cart/`, {
//           headers: { Authorization: `Token ${token}` },
//         });
//         const data = await res.json();
//         setCartItems(data);
//         setTotal(data.reduce((sum, item) => sum + item.product_price * item.quantity, 0));
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchCart();
//   }, [token]);

//   /* ---------------- FETCH ADDRESSES ---------------- */
//   useEffect(() => {
//     const fetchAddresses = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/addresses/`, {
//           headers: { Authorization: `Token ${token}` },
//         });
//         const data = await res.json();
//         setAddresses(data);
//         if (data.length > 0) setSelectedAddress(data[0]); // default selection
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAddresses();
//   }, [token]);

//   /* ---------------- ADD NEW ADDRESS ---------------- */
//   const handleAddAddress = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch(`${API_BASE}/addresses/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${token}`,
//         },
//         body: JSON.stringify(newAddress),
//       });
//       const data = await res.json();
//       setAddresses([...addresses, data]);
//       setSelectedAddress(data);
//       setShowForm(false);
//       setNewAddress({
//         full_name: "",
//         phone: "",
//         street: "",
//         city: "",
//         state: "",
//         postal_code: "",
//         country: "",
//       });
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Failed to add address");
//     }
//   };

//   /* ---------------- PLACE ORDER ---------------- */
//   const handlePlaceOrder = async () => {
//     if (!selectedAddress) {
//       setMessage("⚠️ Please select a delivery address!");
//       return;
//     }

//     setProcessing(true);
//     try {
//       const res = await fetch(`${API_BASE}/orders/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${token}`,
//         },
//         body: JSON.stringify({
//           address: selectedAddress.id,
//           payment_method: paymentMethod,
//         }),
//       });
//       if (!res.ok) throw new Error("Order failed");
//       setMessage("🎉 Order placed successfully!");
//       setTimeout(() => navigate("/orders"), 1800);
//     } catch (err) {
//       setMessage("❌ Failed to place order");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   if (loading)
//     return (
//       <p style={{ textAlign: "center", marginTop: "40px", color: "#666" }}>
//         Loading checkout...
//       </p>
//     );

//   return (
//     <div
//       style={{
//         maxWidth: "1100px",
//         margin: "30px auto",
//         padding: "20px",
//         fontFamily: "Arial, sans-serif",
//         minHeight: "100vh",
//         background: "#f5f7fa",
//       }}
//     >
//       <h2 style={{ fontSize: "30px", fontWeight: "700", color: "#1a237e", marginBottom: "25px" }}>
//         Checkout
//       </h2>

//       {message && (
//         <div
//           style={{
//             backgroundColor: "#e8f5e9",
//             color: "#2e7d32",
//             padding: "12px",
//             borderRadius: "8px",
//             textAlign: "center",
//             fontWeight: "600",
//             marginBottom: "20px",
//           }}
//         >
//           {message}
//         </div>
//       )}

//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
//         {/* LEFT: SHIPPING + PAYMENT */}
//         <div
//           style={{
//             background: "#fff",
//             padding: "20px",
//             borderRadius: "12px",
//             boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//           }}
//         >
//           {/* SELECT ADDRESS */}
//           <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "10px" }}>
//             Select Shipping Address
//           </h3>
//           {addresses.length === 0 && <p>No saved addresses.</p>}
//           {addresses.map((addr) => (
//             <div key={addr.id} style={{ marginBottom: "10px" }}>
//               <input
//                 type="radio"
//                 name="address"
//                 checked={selectedAddress?.id === addr.id}
//                 onChange={() => setSelectedAddress(addr)}
//               />
//               <label style={{ marginLeft: "8px" }}>
//                 {addr.full_name}, {addr.phone}, {addr.street}, {addr.city}, {addr.state},{" "}
//                 {addr.postal_code}, {addr.country}
//               </label>
//             </div>
//           ))}

//           <button
//             onClick={() => setShowForm(!showForm)}
//             style={{
//               margin: "10px 0",
//               padding: "8px 12px",
//               borderRadius: "6px",
//               border: "none",
//               background: "#0d47a1",
//               color: "white",
//               cursor: "pointer",
//             }}
//           >
//             {showForm ? "Cancel" : "Add New Address"}
//           </button>

//           {showForm && (
//             <form onSubmit={handleAddAddress} style={{ marginTop: "10px" }}>
//               {[
//                 ["full_name", "Full Name"],
//                 ["phone", "Phone Number"],
//                 ["street", "Street Address"],
//                 ["city", "City"],
//                 ["state", "State"],
//                 ["postal_code", "Postal Code"],
//                 ["country", "Country"],
//               ].map(([key, label]) => (
//                 <div key={key} style={{ marginBottom: "8px" }}>
//                   <input
//                     type="text"
//                     placeholder={label}
//                     value={newAddress[key]}
//                     required
//                     onChange={(e) => setNewAddress({ ...newAddress, [key]: e.target.value })}
//                     style={{
//                       width: "100%",
//                       padding: "8px",
//                       borderRadius: "6px",
//                       border: "1px solid #ccc",
//                     }}
//                   />
//                 </div>
//               ))}
//               <button
//                 type="submit"
//                 style={{
//                   padding: "8px 12px",
//                   borderRadius: "6px",
//                   border: "none",
//                   background: "#1565c0",
//                   color: "white",
//                   cursor: "pointer",
//                 }}
//               >
//                 Save Address
//               </button>
//             </form>
//           )}

//           {/* PAYMENT */}
//           <h3 style={{ fontSize: "20px", fontWeight: "600", marginTop: "25px", marginBottom: "10px" }}>
//             Payment Method
//           </h3>
//           <select
//             value={paymentMethod}
//             onChange={(e) => setPaymentMethod(e.target.value)}
//             style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
//           >
//             <option value="COD">Cash on Delivery</option>
//             <option value="RAZORPAY">Credit / Debit / UPI</option>
//           </select>

//           {paymentMethod === "COD" && (
//             <button
//               onClick={handlePlaceOrder}
//               disabled={processing}
//               style={{
//                 marginTop: "25px",
//                 width: "100%",
//                 padding: "15px",
//                 backgroundColor: "#ff9800",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: "10px",
//                 fontSize: "16px",
//                 fontWeight: "700",
//                 cursor: "pointer",
//               }}
//             >
//               {processing ? "Placing Order..." : "Place COD Order"}
//             </button>
//           )}
//         </div>

//         {/* RIGHT: ORDER SUMMARY */}
//         <div
//           style={{
//             background: "#fff",
//             padding: "20px",
//             borderRadius: "12px",
//             boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//           }}
//         >
//           <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "15px" }}>
//             Order Summary
//           </h3>

//           {cartItems.map((item) => (
//             <div
//               key={item.id}
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 marginBottom: "15px",
//                 paddingBottom: "10px",
//                 borderBottom: "1px solid #eee",
//               }}
//             >
//               <div style={{ display: "flex", gap: "12px" }}>
//                 <img
//                   src={item.product_image}
//                   alt={item.product_name}
//                   style={{ width: "65px", height: "65px", borderRadius: "8px", objectFit: "cover" }}
//                 />
//                 <div>
//                   <p style={{ fontWeight: "600" }}>{item.product_name}</p>
//                   <p style={{ fontSize: "13px", color: "#777" }}>
//                     Qty: {item.quantity} × ₹{item.product_price}
//                   </p>
//                 </div>
//               </div>
//               <p style={{ fontWeight: "700" }}>₹{(item.product_price * item.quantity).toFixed(2)}</p>
//             </div>
//           ))}

//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               fontSize: "18px",
//               fontWeight: "700",
//               marginTop: "15px",
//               borderTop: "2px solid #ddd",
//               paddingTop: "15px",
//             }}
//           >
//             <span>Total:</span>
//             <span>₹{total.toFixed(2)}</span>
//           </div>

//           {paymentMethod === "RAZORPAY" && <PaymentButton total={total} address={selectedAddress} token={token} />}
//         </div>
//       </div>

//       {/* BACK TO HOME */}
//       <div style={{ textAlign: "center", margin: "40px 0" }}>
//         <button
//           onClick={() => navigate("/home")}
//           style={{
//             backgroundColor: "#1e88e5",
//             color: "white",
//             padding: "12px 25px",
//             border: "none",
//             borderRadius: "8px",
//             cursor: "pointer",
//             fontWeight: "bold",
//             fontSize: "15px",
//           }}
//         >
//           Back to Home
//         </button>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaymentButton from "./PaymentButton";

const API_BASE = "http://localhost:8000/api";

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    full_name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [processing, setProcessing] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ---------------- FETCH CART ---------------- */
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${API_BASE}/cart/`, {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await res.json();
        setCartItems(data);
        setTotal(data.reduce((sum, item) => sum + item.product_price * item.quantity, 0));
      } catch (err) {
        console.error(err);
      }
    };
    fetchCart();
  }, [token]);

  /* ---------------- FETCH ADDRESSES ---------------- */
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch(`${API_BASE}/addresses/`, {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await res.json();
        setAddresses(data);
        if (data.length > 0) setSelectedAddress(data[0]); // default selection
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, [token]);

  /* ---------------- ADD NEW ADDRESS ---------------- */
  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/addresses/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(newAddress),
      });
      const data = await res.json();
      setAddresses([...addresses, data]);
      setSelectedAddress(data);
      setShowForm(false);
      setNewAddress({
        full_name: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
      });
      setMessage("✅ Address added successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add address");
    }
  };

  /* ---------------- PLACE ORDER ---------------- */
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setMessage("⚠️ Please select a delivery address!");
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          address: selectedAddress.id,
          payment_method: paymentMethod,
        }),
      });

      if (!res.ok) throw new Error("Order failed");
      setMessage("🎉 Order placed successfully!");
      setTimeout(() => navigate("/orders"), 1800);
    } catch (err) {
      setMessage("❌ Failed to place order");
    } finally {
      setProcessing(false);
    }
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "40px", color: "#666" }}>
        Loading checkout...
      </p>
    );

  return (
    <div style={{ maxWidth: "1100px", margin: "30px auto", padding: "20px", fontFamily: "Arial, sans-serif", minHeight: "100vh", background: "#f5f7fa" }}>
      <h2 style={{ fontSize: "30px", fontWeight: "700", color: "#1a237e", marginBottom: "25px" }}>Checkout</h2>

      {message && (
        <div style={{ backgroundColor: "#e8f5e9", color: "#2e7d32", padding: "12px", borderRadius: "8px", textAlign: "center", fontWeight: "600", marginBottom: "20px" }}>
          {message}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
        {/* LEFT: SHIPPING + PAYMENT */}
        <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          {/* SELECT ADDRESS */}
          <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "10px" }}>Select Shipping Address</h3>
          {addresses.length === 0 && <p>No saved addresses.</p>}
          {addresses.map((addr) => (
            <div key={addr.id} style={{ marginBottom: "10px" }}>
              <input type="radio" name="address" checked={selectedAddress?.id === addr.id} onChange={() => setSelectedAddress(addr)} />
              <label style={{ marginLeft: "8px" }}>
                {addr.full_name}, {addr.phone}, {addr.street}, {addr.city}, {addr.state}, {addr.postal_code}, {addr.country}
              </label>
            </div>
          ))}

          <button onClick={() => setShowForm(!showForm)} style={{ margin: "10px 0", padding: "8px 12px", borderRadius: "6px", border: "none", background: "#0d47a1", color: "white", cursor: "pointer" }}>
            {showForm ? "Cancel" : "Add New Address"}
          </button>

          {showForm && (
            <form onSubmit={handleAddAddress} style={{ marginTop: "10px" }}>
              {[
                ["full_name", "Full Name"],
                ["phone", "Phone Number"],
                ["street", "Street Address"],
                ["city", "City"],
                ["state", "State"],
                ["postal_code", "Postal Code"],
                ["country", "Country"],
              ].map(([key, label]) => (
                <div key={key} style={{ marginBottom: "8px" }}>
                  <input
                    type="text"
                    placeholder={label}
                    value={newAddress[key]}
                    required
                    onChange={(e) => setNewAddress({ ...newAddress, [key]: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
              ))}
              <button type="submit" style={{ padding: "8px 12px", borderRadius: "6px", border: "none", background: "#1565c0", color: "white", cursor: "pointer" }}>
                Save Address
              </button>
            </form>
          )}

          {/* PAYMENT */}
          <h3 style={{ fontSize: "20px", fontWeight: "600", marginTop: "25px", marginBottom: "10px" }}>Payment Method</h3>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}>
            <option value="COD">Cash on Delivery</option>
            <option value="RAZORPAY">Credit / Debit / UPI</option>
          </select>

          {paymentMethod === "COD" && (
            <button onClick={handlePlaceOrder} disabled={processing} style={{ marginTop: "25px", width: "100%", padding: "15px", backgroundColor: "#ff9800", color: "#fff", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}>
              {processing ? "Placing Order..." : "Place COD Order"}
            </button>
          )}
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "15px" }}>Order Summary</h3>

          {cartItems.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", paddingBottom: "10px", borderBottom: "1px solid #eee" }}>
              <div style={{ display: "flex", gap: "12px" }}>
                <img src={item.product_image} alt={item.product_name} style={{ width: "65px", height: "65px", borderRadius: "8px", objectFit: "cover" }} />
                <div>
                  <p style={{ fontWeight: "600" }}>{item.product_name}</p>
                  <p style={{ fontSize: "13px", color: "#777" }}>Qty: {item.quantity} × ₹{item.product_price}</p>
                </div>
              </div>
              <p style={{ fontWeight: "700" }}>₹{(item.product_price * item.quantity).toFixed(2)}</p>
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "700", marginTop: "15px", borderTop: "2px solid #ddd", paddingTop: "15px" }}>
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

  {paymentMethod === "RAZORPAY" && selectedAddress && (
  <PaymentButton
    total={total}
    address={`${selectedAddress.full_name}, ${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.postal_code}, ${selectedAddress.country}`}
    token={token}
  />
)}

        </div>
      </div>

      {/* BACK TO HOME */}
      <div style={{ textAlign: "center", margin: "40px 0" }}>
        <button onClick={() => navigate("/home")} style={{ backgroundColor: "#1e88e5", color: "white", padding: "12px 25px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "15px" }}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
