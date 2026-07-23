"use client";

import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import styles from "./Checkout.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CheckoutSummary from "../../components/Checkout/CheckoutSummary/CheckoutSummary";

export default function CheckoutPage() {
  const [payment, setPayment] = useState("Cash on Delivery");
  const { cart, applyCoupon, removeCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: "Home", text: "" });
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  
  const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth`;

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const res = await fetch(`${API_BASE_URL}/addresses`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && data.addresses) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]._id);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoadingAddresses(false);
    }
  };
 
  
  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.text.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setAddresses([...addresses, data.address]);
        setSelectedAddress(data.address._id);
        setShowAddForm(false);
        setNewAddress({ label: "Home", text: "" });
      }
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }
    
    if (!user) {
      alert("Please login to place an order");
      return;
    }

    const addr = addresses.find((a) => a._id === selectedAddress);
    
    const shippingAddress = {
      fullName: user.fullName || "Guest",
      phone: user.phone || "0000000000",
      address: addr?.text || "",
      city: "N/A",
      state: "N/A",
      pincode: "N/A",
      country: "India",
    };

    try {
      const results = [];
      for (const item of cart.products) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
          body: JSON.stringify({
            productId: item.productId,
            userId: user._id,
            quantity: item.quantity,
            paymentMethod: payment,
            shippingAddress: shippingAddress,
          }),
        });
        const data = await res.json();
        results.push(data);
      }
      
      const hasError = results.find((r) => !r.success);
      
      if (hasError) {
        alert(hasError.message || "Error placing one or more orders.");
      } else {
        alert("Order successfully placed!");
        await clearCart();
        router.push("/orders");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Something went wrong while placing the order.");
    }
  };

  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <section className={styles.container}>
        <div className={styles.emptyState}>
          <h1>Checkout</h1>
          <p>Your cart is empty.</p>
          <Link href="/products" className={styles.shopButton}>
            Go to Shop
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      {/* <div className={styles.header}>
        <h1>Checkout</h1>
        <p>Complete your order securely</p>
      </div> */}

      <div className={styles.grid}>
        <div className={styles.mainContent}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Delivery Address</h2>
              {!showAddForm && (
                <button 
                  className={styles.addBtn}
                  onClick={() => setShowAddForm(true)}
                >
                  + Add New
                </button>
              )}
            </div>

            {loadingAddresses ? (
              <p className={styles.loadingText}>Loading addresses...</p>
            ) : (
              <div className={styles.addressList}>
                {addresses.map((addr) => (
                  <div 
                    key={addr._id} 
                    className={`${styles.addressItem} ${selectedAddress === addr._id ? styles.selected : ''}`}
                    onClick={() => setSelectedAddress(addr._id)}
                  >
                    <div className={styles.radioWrapper}>
                      <input 
                        type="radio" 
                        checked={selectedAddress === addr._id} 
                        onChange={() => setSelectedAddress(addr._id)}
                      />
                    </div>
                    <div className={styles.addressDetails}>
                      <span className={styles.addressLabel}>{addr.label}</span>
                      <p className={styles.addressText}>{addr.text}</p>
                    </div>
                  </div>
                ))}
                {!loadingAddresses && addresses.length === 0 && !showAddForm && (
                  <p className={styles.noAddressText}>No saved addresses found. Please add one.</p>
                )}
              </div>
            )}

            {showAddForm && (
              <form onSubmit={handleAddAddress} className={styles.addressForm}>
                <div className={styles.formGroup}>
                  <label>Label</label>
                  <select 
                    value={newAddress.label} 
                    onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Full Address</label>
                  <textarea 
                    placeholder="Enter your full street address, city, state, etc." 
                    rows={4}
                    value={newAddress.text}
                    onChange={(e) => setNewAddress({...newAddress, text: e.target.value})}
                    required
                  />
                </div>
                <div className={styles.formActions}>
                  <button type="button" onClick={() => setShowAddForm(false)} className={styles.cancelBtn}>Cancel</button>
                  <button type="submit" className={styles.saveBtn}>Save Address</button>
                </div>
              </form>
            )}
          </div>

          <div className={styles.card}>
            <h2>Payment Method</h2>
            <div className={styles.paymentMethods}>
              {["Cash on Delivery", "UPI", "Credit Card", "Debit Card", "Net Banking"].map((item) => (
                <label 
                  key={item} 
                  className={`${styles.paymentItem} ${payment === item ? styles.selectedPayment : ''}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === item}
                    onChange={() => setPayment(item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <CheckoutSummary 
          cart={cart}
          selectedAddress={selectedAddress}
          handlePlaceOrder={handlePlaceOrder}
          applyCoupon={applyCoupon}
          removeCoupon={removeCoupon}
        />
      </div>
    </section>
  );
}