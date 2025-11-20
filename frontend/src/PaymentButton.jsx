import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000/api";

export default function PaymentButton({ total, address, token }) {
  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!address.trim()) return alert("Enter delivery address!");
    setProcessing(true);

    try {
      // 1️⃣ Create Razorpay order on backend
      const orderRes = await fetch(`${API_BASE}/checkout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          address,
          payment_method: "RAZORPAY",
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) throw new Error(orderData.detail || "Order creation failed");

      // 2️⃣ Open Razorpay checkout
      const options = {
        key: orderData.key_id, // provided by backend
        amount: orderData.amount,
        currency: orderData.currency,
        name: "My Shop",
        description: "Purchase",
        order_id: orderData.order_id, // ✅ FIXED HERE
        handler: async function (response) {
          try {
            // 3️⃣ Verify payment on backend
            const verifyRes = await fetch(`${API_BASE}/razorpay/verify-payment/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) throw new Error("Payment verification failed");

            setSuccess(true);
            setTimeout(() => navigate("/orders"), 2500);

          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment verification failed!");
          }
        },
        theme: { color: "#ff9900" },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Try again!");
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          backgroundColor: "#e6f4ea",
          borderRadius: "12px",
          fontSize: "20px",
          fontWeight: "bold",
          color: "#2e7d32",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          animation: "bounce 0.8s",
        }}
      >
        🎉 Payment Successful! Redirecting to Orders...
      </div>
    );
  }

  return (
    <button
      onClick={handlePayment}
      disabled={processing}
      style={{
        backgroundColor: "#ff9900",
        color: "#fff",
        width: "100%",
        padding: "14px",
        fontSize: "16px",
        fontWeight: "bold",
        border: "none",
        borderRadius: "8px",
        marginTop: "20px",
        cursor: "pointer",
        transition: "0.3s",
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = "#e68a00")}
      onMouseOut={(e) => (e.target.style.backgroundColor = "#ff9900")}
    >
      {processing ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
    </button>
  );
}
