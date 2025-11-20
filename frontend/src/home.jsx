


import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:8000/api";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [message, setMessage] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    full_name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    is_default: false,
  });
  const [searchTerm, setSearchTerm] = useState("");




  /* ------- search handler ----- */
  const handleSearch = async () => {
    try {
      const res = await fetch(`${API_BASE}/products/?search=${searchTerm}`);
      const data = await res.json();
      setCategories([{ id: "search", name: "Search Results", products: data }]);
    } catch (err) {
      console.error(err);
    }
  };


  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/categories/`);
        const data = await res.json();

        if (Array.isArray(data)) setCategories(data);
        else if (Array.isArray(data.results)) setCategories(data.results);
        else setCategories([]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  /* ---------------- FETCH ADDRESSES ---------------- */
  useEffect(() => {
    if (!token) return;

    const fetchAddresses = async () => {
      try {
        const res = await axios.get(`${API_BASE}/addresses/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setAddresses(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAddresses();
  }, [token]);

  /* ---------------- ADD TO CART ---------------- */
  const addToCart = async (productId) => {
    if (!token) return alert("Please log in first!");

    try {
      const res = await fetch(`${API_BASE}/cart/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ product: productId, quantity: 1 }),
      });

      if (res.ok) {
        setMessage("Product added to cart!");
        setTimeout(() => setMessage(""), 1500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => navigate("/logout");

  /* ---------------- HANDLE ADDRESS FORM ---------------- */
  const handleAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/addresses/`, newAddress, {
        headers: { Authorization: `Token ${token}` },
      });
      setAddresses([...addresses, res.data]);
      setMessage("✅ Address added!");
      setTimeout(() => setMessage(""), 1500);
      setNewAddress({
        full_name: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        is_default: false,
      });
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add address");
    }
  };

  /* ---------------- INLINE STYLES ---------------- */
  const styles = {
    page: { background: "#f3f6ff", minHeight: "100vh", fontFamily: "Arial, sans-serif" },
    header: { background: "#0d47a1", padding: "14px 22px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" },
    nav: { display: "flex", gap: "18px", alignItems: "center", position: "relative" },
    navLink: { color: "white", textDecoration: "none", fontSize: "16px", cursor: "pointer" },
    logoutBtn: { background: "#1565c0", padding: "8px 14px", borderRadius: "6px", color: "white", border: "none", cursor: "pointer" },
    dropdown: { position: "absolute", top: "100%", right: 0, background: "#fff", color: "#000", padding: "15px", boxShadow: "0 3px 12px rgba(0,0,0,0.2)", borderRadius: "8px", zIndex: 100, width: "300px" },
    input: { width: "100%", padding: "8px", marginBottom: "8px", borderRadius: "6px", border: "1px solid #ccc" },
    btn: { padding: "8px 12px", background: "#0d47a1", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", width: "100%" },
    toast: { position: "fixed", top: "90px", right: "20px", background: "#0d47a1", padding: "12px 16px", color: "white", borderRadius: "8px", zIndex: 10 },
    hero: { background: "linear-gradient(to right, #1976d2, #0d47a1)", padding: "55px 15px", color: "white", textAlign: "center", borderRadius: "0 0 20px 20px", marginBottom: "20px" },
    exploreBtn: { background: "white", color: "#0d47a1", padding: "10px 18px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", marginTop: "12px" },
  };

  /* ---------------- JSX ---------------- */


  return (
    <div style={styles.page}>
      {/* HEADER */}
      <header style={styles.header}>
        <h1 style={{ margin: 0 }}>MiniShop</h1>
        <nav style={styles.nav}>
          <Link
            style={styles.navLink}
            to="/home"
            onClick={() => navigate(0)}
          >
            Home
          </Link>


          <Link style={styles.navLink} to="/cart">Cart</Link>


          {/* PROFILE BUTTON */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <button
              style={{
                backgroundColor: "#1e88e5",
                color: "white",
                padding: "8px 14px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
                transition: "0.2s",
              }}
              onClick={() => setShowProfile(!showProfile)}
              onMouseOver={e => e.currentTarget.style.backgroundColor = "#1565c0"}
              onMouseOut={e => e.currentTarget.style.backgroundColor = "#1e88e5"}
            >
              Profile ▼
            </button>

            {showProfile && (
              <div style={styles.dropdown}>
                {/* Profile Menu */}
                {!activeTab && (
                  <div>
                    <button
                      style={{ display: "block", width: "100%", padding: "8px", marginBottom: "6px", cursor: "pointer" }}
                      onClick={() => setActiveTab("profile")}
                    >
                      View Profile
                    </button>

                    {/* Navigate to Orders page */}
                    <button
                      onClick={() => navigate("/orders")}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "8px",
                        marginBottom: "6px",
                        cursor: "pointer",
                        backgroundColor: "#1e88e5",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: "600",
                        transition: "0.2s",
                      }}
                      onMouseOver={e => e.currentTarget.style.backgroundColor = "#1565c0"}
                      onMouseOut={e => e.currentTarget.style.backgroundColor = "#1e88e5"}
                    >
                      View Orders
                    </button>

                    <button
                      style={{ display: "block", width: "100%", padding: "8px", cursor: "pointer", background: "#e53935", color: "white", border: "none" }}
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}

                {/* Address Form */}
                {activeTab === "profile" && (
                  <div>
                    <h4>Saved Addresses</h4>
                    {addresses.length ? (
                      addresses.map(a => (
                        <div key={a.id} style={{ marginBottom: "8px", fontSize: "14px" }}>
                          <strong>{a.full_name}</strong><br />
                          {a.phone}<br />
                          {a.street}, {a.city}, {a.state} {a.postal_code}<br />
                          {a.country}<br />
                          {a.is_default && <span style={{ color: "green" }}>Default</span>}
                        </div>
                      ))
                    ) : <p>No addresses saved.</p>}

                    <hr style={{ margin: "10px 0" }} />
                    <h4>Add New Address</h4>
                    <form onSubmit={handleAddAddress}>
                      {Object.keys(newAddress).filter(k => k !== "is_default").map(key => (
                        <input
                          key={key}
                          type="text"
                          name={key}
                          placeholder={key.replace("_", " ").toUpperCase()}
                          value={newAddress[key]}
                          onChange={handleAddressChange}
                          style={styles.input}
                        />
                      ))}
                      <button type="submit" style={styles.btn}>Save Address</button>
                    </form>
                    <button onClick={() => setActiveTab(null)} style={{ marginTop: "8px", color: "#0d47a1", cursor: "pointer", background: "none", border: "none" }}>Back</button>
                  </div>
                )}
              </div>
            )}
          </div>

        </nav>
      </header>



      {/* TOAST */}
      {message && <div style={styles.toast}>{message}</div>}

      {/* HERO */}
      <section style={styles.hero}>
        <h2>Welcome to MiniShop 🛍️</h2>
        <p>Your one-stop shop for the best deals!</p>
        <button style={styles.exploreBtn} onClick={() => navigate("/products")}>Explore Products →</button>
      </section>

      {/* SEARCH BAR */}
      <div style={{ display: "flex", justifyContent: "center", margin: "15px 0" }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px 12px",
            width: "300px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <button
          style={{
            marginLeft: "8px",
            padding: "8px 12px",
            backgroundColor: "#0d47a1",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          onClick={handleSearch}
        >
          Search
        </button>
      </div>





      {/* CATEGORY BAR */}
      <div style={{ display: "flex", gap: "10px", overflowX: "auto", padding: "10px" }}>
        <button style={!selectedCategory ? { background: "#0d47a1", color: "#fff", padding: "8px 14px", borderRadius: "6px", cursor: "pointer" } : { padding: "8px 14px", borderRadius: "6px", background: "#e3eaff", color: "#0d47a1", fontWeight: "600", cursor: "pointer" }} onClick={() => setSelectedCategory(null)}>All</button>
        {categories.map(cat => (
          <button key={cat.id} style={selectedCategory === cat.slug ? { background: "#0d47a1", color: "#fff", padding: "8px 14px", borderRadius: "6px", cursor: "pointer" } : { padding: "8px 14px", borderRadius: "6px", background: "#e3eaff", color: "#0d47a1", fontWeight: "600", cursor: "pointer" }} onClick={() => setSelectedCategory(cat.slug)}>{cat.name}</button>
        ))}
      </div>

      {/* PRODUCT SECTIONS */}
      {categories.filter(cat => !selectedCategory || selectedCategory === cat.slug).map(cat => (
        <section key={cat.id} style={{ padding: "15px 20px" }}>
          <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#0d47a1", marginBottom: "8px" }}>{cat.name} →</h3>
          <div style={{ display: "flex", overflowX: "auto", gap: "15px", paddingBottom: "10px" }}>
            {Array.isArray(cat.products) && cat.products.map(p => (
              <div key={p.id} style={{ background: "white", minWidth: "180px", minHeight: "300px", padding: "15px", borderRadius: "12px", boxShadow: "0 3px 8px rgba(0,0,0,0.1)", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "0.2s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                <Link to={`/product/${p.id}`} style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <img src={p.image} alt={p.name} style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }} />
                  <h4 style={{ margin: "8px 0 4px" }}>{p.name}</h4>
                  <p style={{ fontWeight: "700", color: "#0d47a1" }}>₹{p.price}</p>
                </Link>
                <button style={{ background: "#1565c0", color: "white", padding: "8px", borderRadius: "8px", border: "none", marginTop: "12px", cursor: "pointer", width: "100%" }} onClick={() => addToCart(p.id)}>Add to Cart</button>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* FOOTER */}
      <footer style={{
        background: "#0d47a1",
        color: "white",
        textAlign: "center",
        padding: "12px",
        marginTop: "40px"
      }}>
        © {new Date().getFullYear()} MiniShop — All Rights Reserved
        <div style={{ marginTop: "10px" }}>
        </div>
      </footer>

    </div>
  );
}



