

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./home.jsx";
import ProductList from "./ProductList.jsx";
import ProductDetail from "./ProductDetails.jsx";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import Logout from "./Logout.jsx";
import Cart from "./Cart.jsx";
import Checkout from "./Checkout.jsx";
import OrderList from "./Order.jsx";
import OrderDetail from "./Orderdetails.jsx";
import "./index.css";

// Protected route component
function ProtectedRoute({ element }) {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" replace />;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Authentication routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        {/* Protected routes */}
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/products" element={<ProtectedRoute element={<ProductList />} />} />
        <Route path="/product/:id" element={<ProtectedRoute element={<ProductDetail />} />} />
        <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
        <Route path="/checkout" element={<ProtectedRoute element={<Checkout />} />} />
        <Route path="/orders" element={<ProtectedRoute element={<OrderList />} />} />
        <Route path="/orders/:id" element={<ProtectedRoute element={<OrderDetail />} />} />

        



        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
