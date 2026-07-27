"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

import DeliveryAddress from "../../components/Checkout/DeliveryAddress/DeliveryAddress";
import CheckoutSummary from "../../components/Checkout/CheckoutSummary/CheckoutSummary";
import { toast } from "react-toastify";
import styles from "./Checkout.module.css";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { cart, applyCoupon, removeCoupon, clearCart, removeItem } = useCart();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const buyNowProductId = searchParams.get("buyNow");
  const buyNowColor = searchParams.get("color");
  const buyNowSize = searchParams.get("size");

  const checkoutCart = useMemo(() => {
    if (!cart || !buyNowProductId) return cart;

    const product = cart.products.find((item) => {
      const id = item.productId?._id || item.productId;

      return (
        id === buyNowProductId &&
        (!buyNowColor || item.color === buyNowColor) &&
        (!buyNowSize || item.size === buyNowSize)
      );
    });

    if (!product) return cart;

    const totalPrice = product.originalPrice * product.quantity;
    const finalPrice = product.price * product.quantity;

    return {
      ...cart,
      products: [product],
      totalPrice,
      totalDiscount: totalPrice - finalPrice,
      finalPrice,
    };
  }, [cart, buyNowProductId, buyNowColor, buyNowSize]);

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
      address: addr?.text || addr?.address || "",
      city: addr?.city || "N/A",
      state: addr?.state || "N/A",
      pincode: addr?.pincode || "N/A",
      country: addr?.country || "India",
    };

    
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
      const orderResults = await Promise.all(
        checkoutCart.products.map(async (product) => {
          const response = await fetch(`${apiUrl}/api/orders/create`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              productId: product.productId?._id || product.productId,
              userId: user._id,
              quantity: product.quantity,
              paymentMethod,
              shippingAddress,
            }),
          });

          return response.json();
        })
      );

      const failedOrder = orderResults.find(
        (order) => !order.success
      );

      if (failedOrder) {
        alert(failedOrder.message || "Unable to place the order.");
        return;
      }
      
      const hasError = orderResults.find((r) => !r.success);
      
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

      router.push("/orders");
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Something went wrong while placing the order.");
    }
  };

  if (
    !checkoutCart ||
    !checkoutCart.products ||
    checkoutCart.products.length === 0
  ) {
    return (
      <section className={styles.container}>
        <div className={styles.emptyState}>
          <h1>Checkout</h1>
          <p>Your cart is empty.</p>

          <Link href="/products" className={styles.shopButton}>
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  const paymentOptions = [
    "Cash on Delivery",
    "UPI",
    "Credit Card",
    "Debit Card",
    "Net Banking",
  ];

  return (
    <section className={styles.container}>
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
              {paymentOptions.map((option) => (
                <label
                  key={option}
                  className={`${styles.paymentItem} ${
                    paymentMethod === option
                      ? styles.selectedPayment
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === option}
                    onChange={() => setPaymentMethod(option)}
                  />

                  <span>{option}</span>
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
    <Suspense
      fallback={
        <div
          style={{
            padding: "50px",
            textAlign: "center",
          }}
        >
          Loading checkout...
        </div>
      }
    >
      <CheckoutContent />
      
    </Suspense>
  );
}