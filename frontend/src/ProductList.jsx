

// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "./productlist.css";

// const API_BASE = "http://localhost:8000/api";

// export default function ProductList() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Get category slug
//   const queryParams = new URLSearchParams(location.search);
//   const categorySlug = queryParams.get("category");

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         let url = `${API_BASE}/products/`;
//         if (categorySlug) url += `?category=${categorySlug}`;
//         const res = await fetch(url);
//         if (!res.ok) throw new Error("Failed to load products");
//         const data = await res.json();
//         setProducts(data);
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setMessage("❌ Could not load products.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, [categorySlug]);

//   // Add to cart
//   const addToCart = async (productId) => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setMessage("⚠️ Please login first!");
//       return;
//     }

//     try {
//       const res = await fetch(`${API_BASE}/cart/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${token}`,
//         },
//         body: JSON.stringify({ product: productId, quantity: 1 }),
//       });

//       if (!res.ok) throw new Error("Failed to add to cart");

//       setMessage("✅ Product added to cart!");
//       setTimeout(() => setMessage(""), 2000);
//     } catch (err) {
//       console.error("Add to cart error:", err);
//       setMessage("❌ Error adding to cart");
//     }
//   };

//   if (loading) return <p className="loading">Loading products...</p>;

//   return (
//     <div className="product-list-container">
//       <div className="header">
//         {/* ❌ Removed top Back to Home button */}
//         <h2 className="title">
//           {categorySlug ? `Category: ${categorySlug}` : "All Products"}
//         </h2>
//       </div>

//       {message && <p className="message">{message}</p>}

//       {products.length === 0 ? (
//         <p className="no-products">No products found.</p>
//       ) : (
//         <div className="product-grid">
//           {products.map((p) => (
//             <div key={p.id} className="product-card">
//               {p.image ? (
//                 <img
//                   src={
//                     p.image.startsWith("http")
//                       ? p.image
//                       : `http://localhost:8000${p.image}`
//                   }
//                   alt={p.name}
//                   className="product-image"
//                 />
//               ) : (
//                 <div className="no-image">No Image</div>
//               )}

//               <h3 className="product-name">{p.name}</h3>
//               <p className="product-price">₹{p.price}</p>

//               <div className="button-group">
//                 <button
//                   className="view-btn"
//                   onClick={() => navigate(`/product/${p.id}`)}
//                 >
//                   View Details
//                 </button>

//                 <button className="add-btn" onClick={() => addToCart(p.id)}>
//                   Add to Cart
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* ✅ Back to Home button at the bottom */}
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
//           🏠 Back to Home
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

const API_BASE = "http://localhost:8000/api";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("none");
  const ITEMS_PER_PAGE = 12;

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categorySlug = queryParams.get("category");

  /* ---------- STYLES ---------- */
  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f3f6ff",
      fontFamily: "Arial, sans-serif",
      display: "flex",
      flexDirection: "column",
    },
    header: {
      background: "#0d47a1",
      padding: "16px 32px",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    },
    nav: { display: "flex", gap: "24px", alignItems: "center" },
    navLink: {
      color: "white",
      textDecoration: "none",
      fontSize: "17px",
      fontWeight: "500",
    },
    logoutBtn: {
      background: "white",
      padding: "8px 16px",
      borderRadius: "6px",
      color: "#0d47a1",
      border: "none",
      fontWeight: "600",
      cursor: "pointer",
    },
    container: {
      padding: "30px 40px",
      maxWidth: "1300px",
      margin: "0 auto",
      width: "100%",
    },
    title: {
      fontSize: "26px",
      fontWeight: "700",
      color: "#0d47a1",
      marginBottom: "20px",
      textAlign: "center",
    },
    message: {
      textAlign: "center",
      padding: "10px",
      color: "white",
      background: "#1565c0",
      borderRadius: "6px",
      marginBottom: "20px",
      fontWeight: "600",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
      gap: "25px",
      justifyItems: "center",
    },
    card: {
      background: "white",
      width: "100%",
      padding: "15px",
      borderRadius: "12px",
      boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
      textAlign: "center",
      transition: "0.25s",
      cursor: "pointer",
    },
    productImage: {
      width: "100%",
      height: "200px",
      objectFit: "cover",
      borderRadius: "8px",
      marginBottom: "12px",
    },
    productName: {
      fontSize: "17px",
      fontWeight: "600",
      marginBottom: "6px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    price: {
      fontWeight: "bold",
      color: "#0d47a1",
      marginBottom: "10px",
      fontSize: "18px",
    },
    btn: {
      width: "100%",
      padding: "10px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      marginTop: "8px",
      fontWeight: "bold",
      fontSize: "15px",
    },
    viewBtn: {
      background: "#1976d2",
      color: "white",
    },
    addBtn: {
      background: "#1e88e5",
      color: "white",
    },
    sortContainer: {
      display: "flex",
      justifyContent: "flex-end",
      marginBottom: "15px",
    },
    pagination: {
      marginTop: "35px",
      display: "flex",
      justifyContent: "center",
      gap: "12px",
    },
    footer: {
      background: "#0d47a1",
      color: "white",
      textAlign: "center",
      padding: "14px",
      marginTop: "40px",
      fontSize: "15px",
    },
  };

  /* ---------- FETCH PRODUCTS ---------- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = `${API_BASE}/products/`;
        if (categorySlug) url += `?category=${categorySlug}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load products");

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setMessage("❌ Could not load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categorySlug]);

  /* ---------- ADD TO CART ---------- */
  const addToCart = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) return setMessage("⚠️ Please login first!");

    try {
      const res = await fetch(`${API_BASE}/cart/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ product: productId, quantity: 1 }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");
      setMessage("✅ Product added to cart!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error adding to cart");
    }
  };

  /* ---------- SORTING ---------- */
  const sortProducts = (list, option) => {
    let sorted = [...list];
    switch (option) {
      case "low-high":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "az":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "za":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      default:
        break;
    }
    return sorted;
  };

  /* ---------- PAGINATION ---------- */
  const sortedProducts = sortProducts(products, sortOption);
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---------- LOADING ---------- */
  if (loading)
    return (
      <div style={styles.page}>
        <p style={{ textAlign: "center", marginTop: "40px" }}>
          Loading products...
        </p>
      </div>
    );

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <header style={styles.header}>
        <h1 style={{ margin: 0, fontSize: "26px" }}>MiniShop</h1>
        <nav style={styles.nav}>
          <Link style={styles.navLink} to="/home">Home</Link>
          <Link style={styles.navLink} to="/cart">Cart</Link>
          <button style={styles.logoutBtn} onClick={() => navigate("/logout")}>
            Logout
          </button>
        </nav>
      </header>

      <div style={styles.container}>
        <h2 style={styles.title}>
          {categorySlug ? `Category: ${categorySlug}` : "All Products"}
        </h2>

        {message && <p style={styles.message}>{message}</p>}

        {/* SORT DROPDOWN */}
        <div style={styles.sortContainer}>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          >
            <option value="none">Sort By</option>
            <option value="low-high">Price: Low → High</option>
            <option value="high-low">Price: High → Low</option>
            <option value="az">Name: A → Z</option>
            <option value="za">Name: Z → A</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        {/* PRODUCT GRID */}
        {products.length === 0 ? (
          <p style={{ textAlign: "center" }}>No products found.</p>
        ) : (
          <div style={styles.grid}>
            {currentProducts.map((p) => (
              <div
                key={p.id}
                style={styles.card}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {p.image ? (
                  <img
                    src={p.image.startsWith("http") ? p.image : `http://localhost:8000${p.image}`}
                    alt={p.name}
                    style={styles.productImage}
                  />
                ) : (
                  <div style={{ height: "200px", background: "#ddd" }}>No Image</div>
                )}

                <h3 style={styles.productName}>{p.name}</h3>
                <p style={styles.price}>₹{p.price}</p>

                <button
                  style={{ ...styles.btn, ...styles.viewBtn }}
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  View Details
                </button>

                <button
                  style={{ ...styles.btn, ...styles.addBtn }}
                  onClick={() => addToCart(p.id)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
              style={{
                padding: "8px 14px",
                background: currentPage === 1 ? "#ccc" : "#1565c0",
                color: "white",
                borderRadius: "6px",
                border: "none",
              }}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                style={{
                  padding: "8px 14px",
                  background: currentPage === page ? "#0d47a1" : "#1976d2",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
              style={{
                padding: "8px 14px",
                background: currentPage === totalPages ? "#ccc" : "#1565c0",
                color: "white",
                borderRadius: "6px",
                border: "none",
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={styles.footer}>
        © {new Date().getFullYear()} MiniShop — All Rights Reserved
      </footer>
    </div>
  );
}
