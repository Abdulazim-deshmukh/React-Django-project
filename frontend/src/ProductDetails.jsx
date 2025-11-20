// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";


// const API_BASE = "http://localhost:8000/api";

// export default function ProductDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(null);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/products/${id}/`);
//         const data = await res.json();
//         setProduct(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   const addToCart = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return alert("⚠️ Please login first!");
//     try {
//       const res = await fetch(`${API_BASE}/cart/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${token}`,
//         },
//         body: JSON.stringify({ product: id, quantity: 1 }),
//       });
//       if (res.ok) {
//         setMessage("✅ Product added to cart!");
//         setTimeout(() => setMessage(""), 2000);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (!product) return <p>Loading product...</p>;

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
     
//       {/* <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>← Back</button> */}
//       {message && <p style={{ color: "green" }}>{message}</p>}

//       <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
//         {product.image && <img src={product.image} alt={product.name} style={{ width: "300px", height: "300px", objectFit: "cover" }} />}
//         <div>
//           <h1>{product.name}</h1>
//           <p style={{ fontWeight: "bold", fontSize: "20px", color: "#1e88e5" }}>₹{product.price}</p>
//           <p style={{ marginTop: "10px" }}>{product.description}</p>
//           <button onClick={addToCart} style={{
//             marginTop: "20px",
//             background: "#ff9900",
//             color: "#fff",
//             padding: "10px 15px",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//             fontWeight: "bold",
//           }}>Add to Cart</button>
//         </div>

//         <div style={{ textAlign: "center", margin: "40px 0" }}>
//         <button
//           onClick={() => navigate("/home")}
//           style={{
//             backgroundColor: "#ff9900",
//             color: "white",
//             padding: "12px 25px",
//             border: "none",
//             borderRadius: "8px",
//             cursor: "pointer",
//             fontWeight: "bold",
//             fontSize: "15px",
//           }}
//         >
//           🏠 Back to Home
//         </button>
//       </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000/api";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE}/products/${id}/`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("⚠️ Please login first!");
    try {
      const res = await fetch(`${API_BASE}/cart/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ product: id, quantity: 1 }),
      });
      if (res.ok) {
        setMessage("✅ Product added to cart!");
        setTimeout(() => setMessage(""), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!product) return <p>Loading product...</p>;

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      {/* GREEN SUCCESS MESSAGE */}
      {message && (
        <p
          style={{
            color: "#2e7d32",
            backgroundColor: "#e6f4ea",
            padding: "10px",
            borderRadius: "6px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {message}
        </p>
      )}

      {/* PRODUCT CONTENT */}
      <div
        style={{
          display: "flex",
          gap: "30px",
          flexWrap: "wrap",
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* PRODUCT IMAGE */}
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "330px",
              height: "330px",
              objectFit: "cover",
              borderRadius: "10px",
              boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
              transition: "transform 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.03)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          />
        )}

        {/* PRODUCT INFO */}
        <div style={{ flex: "1" }}>
          <h1
            style={{
              fontSize: "28px",
              color: "#333",
              marginBottom: "10px",
            }}
          >
            {product.name}
          </h1>

          <p
            style={{
              fontWeight: "bold",
              fontSize: "24px",
              color: "#1e88e5",
              marginBottom: "15px",
            }}
          >
            ₹{product.price}
          </p>

          <p
            style={{
              lineHeight: "1.6",
              fontSize: "15px",
              color: "#555",
            }}
          >
            {product.description}
          </p>

          {/* ADD TO CART BUTTON */}
          <button
            onClick={addToCart}
            style={{
              marginTop: "25px",
              background: "#1e88e5",
              color: "#fff",
              padding: "12px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "15px",
              transition: "0.2s",
            }}
            
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>

      {/* HOME BUTTON AT BOTTOM */}
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
