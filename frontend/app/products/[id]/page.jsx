"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiShoppingCart,
  FiHeart,
  FiTruck,
  FiRotateCcw,
  FiShield,
  FiCheck,
  FiClock,
  FiCreditCard,
  FiZap,
  FiRefreshCw,
  FiRepeat,
  FiTag,
  FiMinus,
  FiPlus,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import styles from "./ProductDetails.module.css";
import { useCart } from "../../../context/CartContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const TABS = [
  { key: "details", label: "Details" },
  { key: "specs", label: "Specifications" },
  { key: "shipping", label: "Shipping & Returns" },
  { key: "reviews", label: "Reviews" },
];

const BADGE_CONFIG = [
  { key: "isNewArrival", label: "New Arrival" },
  { key: "isBestSeller", label: "Bestseller" },
  { key: "isTrending", label: "Trending" },
  { key: "isFeatured", label: "Featured" },
];

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const { addToCart } = useCart();
  const [isAddingCart, setIsAddingCart] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  // =============================
  // Get Product
  // =============================
  useEffect(() => {
    if (id) {
      getProduct();
    }
  }, [id]);

  const getProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/products/${id}`);
      const data = await res.json();

      if (data.success) {
        setProduct(data.data);

        if (data.data.images?.length > 0) {
          setMainImage(data.data.images[0].url);
        }

        getRelatedProducts(data.data.category?._id);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Related Products
  // =============================
  const getRelatedProducts = async (categoryId) => {
    try {
      const res = await fetch(`${API}/api/products`);
      const data = await res.json();

      if (data.success) {
        const related = data.data.products.filter(
          (item) => item.category?._id === categoryId && item._id !== id
        );
        setRelatedProducts(related.slice(0, 4));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  

  const handleAddToCart = async () => {
    setIsAddingCart(true);
    await addToCart({
      productId: product._id,
      quantity,
    });
    setIsAddingCart(false);
  };

  const handleBuyNow = async () => {
    setIsBuying(true);
    await addToCart({
      productId: product._id,
      quantity,
    });
    setIsBuying(false);
    
    const query = new URLSearchParams();
    query.set("buyNow", product._id);
    router.push(`/checkout?${query.toString()}`);
  };

  // =============================
  // Loading & Error States
  // =============================
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <span>Loading Product...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.loading}>
        <h2>Product Not Found</h2>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => router.push("/")}
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const activeBadges = BADGE_CONFIG.filter((badge) => product[badge.key]);
  const hasOffer = product.offerEnabled && (product.offerTitle || product.offerValue);
  const measurement = product.measurement;
  const hasMeasurement = measurement && (measurement.value || measurement.type);

  return (
    <section className={styles.productPage}>
      <div className={styles.container}>
        {/* =========================
            Gallery
        ========================== */}
        <div className={styles.galleryRow}>
          <div className={styles.thumbnailContainer}>
            {product.images?.map((image, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.thumbnail} ${
                  mainImage === image.url ? styles.activeThumb : ""
                }`}
                onClick={() => setMainImage(image.url)}
                aria-label={`View product image ${index + 1}`}
              >
                <img src={image.url} alt={`${product.name} preview ${index + 1}`} />
              </button>
            ))}
          </div>

          <div className={styles.mainImageBox}>
            <img
              src={mainImage || "/images/no-image.png"}
              alt={product.name}
              className={styles.mainImage}
            />
          </div>
        </div>

        {/* =========================
            Product Details Right
        ========================== */}
        <div className={styles.right}>
          {activeBadges.length > 0 && (
            <div className={styles.badgeRow}>
              {activeBadges.map((badge) => (
                <span key={badge.key} className={styles.badge}>
                  {badge.label}
                </span>
              ))}
            </div>
          )}

          <div className={styles.eyebrowRow}>
            <span className={styles.category}>
              {typeof product.category === "object"
                ? product.category?.name || "Uncategorized"
                : product.category || "Uncategorized"}
            </span>
            <span className={styles.brand}>
              {product.brand?.name || "No Brand"}
            </span>
          </div>

          <h1 className={styles.title}>{product.name}</h1>

          <div className={styles.rating}>
            <span className={styles.stars}>★★★★★</span>
            <span>({product.ratingsCount || 0} reviews)</span>
          </div>

          {/* Price Section */}
          <div className={styles.priceSection}>
            {product.discountPrice > 0 ? (
              <>
                <h2 className={styles.discountPrice}>
                  ₹{product.discountPrice.toLocaleString()}
                </h2>
                <span className={styles.oldPrice}>
                  ₹{product.price.toLocaleString()}
                </span>
                <span className={styles.save}>
                  {Math.round(
                    ((product.price - product.discountPrice) / product.price) * 100
                  )}
                  % OFF
                </span>
              </>
            ) : (
              <h2 className={styles.price}>₹{product.price.toLocaleString()}</h2>
            )}
          </div>

          {/* Offer Banner */}
          {hasOffer && (
            <div className={styles.offerBanner}>
              <FiTag size={18} />
              <span>
                {product.offerTitle || "Special Offer"}
                {product.offerValue
                  ? ` — ${product.offerValue}${
                      product.offerType === "percentage" ? "%" : " ₹"
                    } off`
                  : ""}
                {product.offerEndDate
                  ? ` · ends ${new Date(product.offerEndDate).toLocaleDateString()}`
                  : ""}
              </span>
            </div>
          )}

          {/* Short Description */}
          {product.shortDescription && (
            <p className={styles.shortDesc}>{product.shortDescription}</p>
          )}

          <div className={styles.divider} />

          {/* Stock + SKU */}
          <div className={styles.metaRow}>
            {product.stock > 10 ? (
              <span className={styles.inStock}>In Stock</span>
            ) : product.stock > 0 ? (
              <span className={styles.lowStock}>Only {product.stock} left</span>
            ) : (
              <span className={styles.outStock}>Out of Stock</span>
            )}
            <span className={styles.sku}>SKU · {product.sku || "N/A"}</span>
          </div>

          {/* Quantity + Cart + Wishlist Single Row */}
          <div className={styles.actionRow}>
            <div className={styles.quantityBox}>
              <button type="button" onClick={decreaseQty} aria-label="Decrease quantity">
                <FiMinus size={14} />
              </button>
              <span>{quantity}</span>
              <button type="button" onClick={increaseQty} aria-label="Increase quantity">
                <FiPlus size={14} />
              </button>
            </div>

            <button className={styles.cartBtn} type="button" onClick={handleAddToCart} disabled={isAddingCart}>
              <FiShoppingCart size={18} />
              {isAddingCart ? "Adding..." : "Add to Cart"}
            </button>

            <button
              type="button"
              className={`${styles.wishBtn} ${
                wishlisted ? styles.wishBtnActive : ""
              }`}
              onClick={() => setWishlisted((prev) => !prev)}
              aria-label="Add to wishlist"
              aria-pressed={wishlisted}
            >
              {wishlisted ? <FaHeart size={17} /> : <FiHeart size={17} />}
            </button>
          </div>

          <button className={styles.buyBtn} type="button" onClick={handleBuyNow} disabled={isBuying}>
            {isBuying ? "Processing..." : "Buy Now"}
          </button>

          {/* Delivery & Returns Single Row */}
          <div className={styles.perksRow}>
            <div className={styles.perk}>
              <FiTruck size={15} />
              <span>{product.freeDelivery ? "Free shipping" : "Fast shipping"}</span>
            </div>
            <div className={styles.perk}>
              <FiRotateCcw size={15} />
              <span>
                {product.returnAvailable
                  ? `${product.returnDays || 7}-day returns`
                  : "No returns"}
              </span>
            </div>
            <div className={styles.perk}>
              <FiShield size={15} />
              <span>Secure payment</span>
            </div>
          </div>
        </div>

        {/* ==========================
            Tabs — Details / Specs / Shipping / Reviews
        =========================== */}
        <div className={styles.tabsSection}>
          <div className={styles.tabBar} role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.key}
                className={`${styles.tabBtn} ${
                  activeTab === tab.key ? styles.tabBtnActive : ""
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className={styles.tabPanel} role="tabpanel">
            {activeTab === "details" && (
              <div className={styles.detailsPanel}>
                <p>{product.description}</p>
                {product.features?.length > 0 && (
                  <>
                    <h3 className={styles.panelSubhead}>Highlights</h3>
                    <ul className={styles.featureList}>
                      {product.features.map((feature, index) => (
                        <li key={index}>
                          <FiCheck size={16} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            {activeTab === "specs" && (
              <table className={styles.specificationTable}>
                <tbody>
                  <tr>
                    <td>Brand</td>
                    <td>{product.brand?.name || "-"}</td>
                  </tr>
                  <tr>
                    <td>Category</td>
                    <td>{product.category?.name || "-"}</td>
                  </tr>
                  <tr>
                    <td>SKU</td>
                    <td>{product.sku || "-"}</td>
                  </tr>
                  <tr>
                    <td>Barcode</td>
                    <td>{product.barcode || "-"}</td>
                  </tr>
                  <tr>
                    <td>Stock</td>
                    <td>{product.stock}</td>
                  </tr>
                  <tr>
                    <td>Price</td>
                    <td>₹{product.price}</td>
                  </tr>
                  <tr>
                    <td>Discount Price</td>
                    <td>
                      {product.discountPrice > 0 ? `₹${product.discountPrice}` : "-"}
                    </td>
                  </tr>

                  {hasMeasurement && (
                    <tr>
                      <td>Measurement</td>
                      <td>
                        {measurement.value} {measurement.unit}
                        {measurement.type ? ` (${measurement.type})` : ""}
                      </td>
                    </tr>
                  )}

                  {product.warranty && (
                    <tr>
                      <td>Warranty</td>
                      <td>{product.warranty}</td>
                    </tr>
                  )}

                  {product.specifications
                    ?.filter((spec) => spec.key)
                    .map((spec, index) => (
                      <tr key={index}>
                        <td>{spec.key}</td>
                        <td>{spec.value || "-"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}

            {activeTab === "shipping" && (
              <div className={styles.shippingPanel}>
                <div className={styles.shippingGrid}>
                  <div className={styles.shippingItem}>
                    <FiTruck size={18} />
                    <div>
                      <h4>Delivery</h4>
                      <p>
                        {product.freeDelivery
                          ? "Free delivery"
                          : product.deliveryCharge
                          ? `₹${product.deliveryCharge} delivery charge`
                          : "Standard delivery charge applies"}
                      </p>
                    </div>
                  </div>

                  <div className={styles.shippingItem}>
                    <FiClock size={18} />
                    <div>
                      <h4>Estimated Delivery</h4>
                      <p>
                        {product.estimatedDays
                          ? `${product.estimatedDays} days`
                          : "3–5 business days"}
                      </p>
                    </div>
                  </div>

                  <div className={styles.shippingItem}>
                    <FiCreditCard size={18} />
                    <div>
                      <h4>Cash on Delivery</h4>
                      <p>{product.cashOnDelivery ? "Available" : "Not available"}</p>
                    </div>
                  </div>

                  <div className={styles.shippingItem}>
                    <FiZap size={18} />
                    <div>
                      <h4>Express Delivery</h4>
                      <p>{product.expressDelivery ? "Available" : "Not available"}</p>
                    </div>
                  </div>

                  <div className={styles.shippingItem}>
                    <FiRotateCcw size={18} />
                    <div>
                      <h4>Returns</h4>
                      <p>
                        {product.returnAvailable
                          ? `${product.returnDays || 7}-day return window`
                          : "Not returnable"}
                      </p>
                    </div>
                  </div>

                  <div className={styles.shippingItem}>
                    <FiRefreshCw size={18} />
                    <div>
                      <h4>Refund</h4>
                      <p>{product.refundAvailable ? "Available" : "Not available"}</p>
                    </div>
                  </div>

                  <div className={styles.shippingItem}>
                    <FiRepeat size={18} />
                    <div>
                      <h4>Replacement</h4>
                      <p>{product.replacementAvailable ? "Available" : "Not available"}</p>
                    </div>
                  </div>

                  {product.warranty && (
                    <div className={styles.shippingItem}>
                      <FiShield size={18} />
                      <div>
                        <h4>Warranty</h4>
                        <p>{product.warranty}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className={styles.reviewSection}>
                {product.reviews?.length > 0 ? (
                  product.reviews.map((review) => (
                    <div key={review._id} className={styles.reviewCard}>
                      <div className={styles.reviewHead}>
                        <h4>{review.user?.name || "Verified Buyer"}</h4>
                        <span className={styles.reviewStars}>
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </span>
                      </div>
                      <p>{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className={styles.noReviews}>No reviews yet.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ==========================
            Related Products Section
        =========================== */}
        {relatedProducts.length > 0 && (
          <div className={styles.relatedSection}>
            <h3 className={styles.relatedTitle}>Related Products</h3>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((relProduct) => (
                <div
                  key={relProduct._id}
                  className={styles.relatedCard}
                  onClick={() => router.push(`/products/${relProduct._id}`)}
                >
                  <div className={styles.relatedImgBox}>
                    <img
                      src={relProduct.images?.[0]?.url || "/images/no-image.png"}
                      alt={relProduct.name}
                    />
                  </div>
                  <div className={styles.relatedInfo}>
                    <h4>{relProduct.name}</h4>
                    <p className={styles.relatedPrice}>₹{relProduct.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
