"use client";

import { useState, useMemo, Suspense } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import styles from "./Checkout.module.css";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import CheckoutSummary from "../../components/Checkout/CheckoutSummary/CheckoutSummary";
import DeliveryAddress from "../../components/Checkout/DeliveryAddress/DeliveryAddress";
import { toast } from "react-toastify";

function CheckoutContent() {
  const [payment, setPayment] = useState("Cash on Delivery");
  const { cart, applyCoupon, removeCoupon, clearCart, removeItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const buyNowProductId = searchParams.get("buyNow");
  const buyNowColor = searchParams.get("color");
  const buyNowSize = searchParams.get("size");

  const checkoutCart = useMemo(() => {
    if (!cart || !buyNowProductId) return cart;
    const item = cart.products.find(
      (p) =>
        (p.productId?._id || p.productId) === buyNowProductId &&
        (!buyNowColor || p.color === buyNowColor) &&
        (!buyNowSize || p.size === buyNowSize)
    );
    if (!item) return cart;

    const totalPrice = item.originalPrice * item.quantity;
    const finalPrice = item.price * item.quantity;
    const totalDiscount = totalPrice - finalPrice;

    return {
      ...cart,
      products: [item],
      totalPrice,
      totalDiscount,
      finalPrice,
    };
  }, [cart, buyNowProductId, buyNowColor, buyNowSize]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    
    if (!user) {
      toast.error("Please login to place an order");
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
      for (const item of checkoutCart.products) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
          body: JSON.stringify({
            productId: item.productId?._id || item.productId,
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
        toast.error(hasError.message || "Error placing one or more orders.");
      } else {
        toast.success("Order successfully placed!");
        if (buyNowProductId) {
          await removeItem(buyNowProductId, buyNowColor || "", buyNowSize || "");
        } else {
          await clearCart();
        }
        router.push("/orders");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Something went wrong while placing the order.");
    }
  };

  if (!checkoutCart || !checkoutCart.products || checkoutCart.products.length === 0) {
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
          <DeliveryAddress 
            addresses={addresses} 
            setAddresses={setAddresses} 
            selectedAddress={selectedAddress} 
            setSelectedAddress={setSelectedAddress} 
          />

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
          cart={checkoutCart}
          selectedAddress={selectedAddress}
          handlePlaceOrder={handlePlaceOrder}
          applyCoupon={applyCoupon}
          removeCoupon={removeCoupon}
        />
      </div>
    </section>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: "50px", textAlign: "center" }}>Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}