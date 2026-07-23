"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./ProductDetails.module.css";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
          (item) =>
            item.category?._id === categoryId &&
            item._id !== id
        );

        setRelatedProducts(related.slice(0, 4));
      }
    } catch (err) {
      console.log(err);
    }
  };

  // =============================
  // Quantity
  // =============================

  const increaseQty = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // =============================
  // Loading
  // =============================

  if (loading) {
    return (
      <div className={styles.loading}>
        Loading Product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.loading}>
        Product Not Found
      </div>
    );
  }

  const activeBadges = BADGE_CONFIG.filter((badge) => product[badge.key]);

  const hasOffer =
    product.offerEnabled &&
    (product.offerTitle || product.offerValue);

  const measurement = product.measurement;
  const hasMeasurement =
    measurement && (measurement.value || measurement.type);

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
              >
                <img src={image.url} alt={product.name} />
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
            Product Details
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
              {product.category?.name || "Uncategorized"}
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

          {/* Price */}

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
                    ((product.price - product.discountPrice) /
                      product.price) *
                      100
                  )}
                  % OFF
                </span>
              </>
            ) : (
              <h2 className={styles.price}>
                ₹{product.price.toLocaleString()}
              </h2>
            )}
          </div>

          {/* Offer banner */}

          {hasOffer && (
            <div className={styles.offerBanner}>
              <OfferIcon />
              <span>
                {product.offerTitle || "Special Offer"}
                {product.offerValue
                  ? ` — ${product.offerValue}${
                      product.offerType === "percentage" ? "%" : " ₹"
                    } off`
                  : ""}
                {product.offerEndDate
                  ? ` · ends ${new Date(
                      product.offerEndDate
                    ).toLocaleDateString()}`
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
              <span className={styles.lowStock}>
                Only {product.stock} left
              </span>
            ) : (
              <span className={styles.outStock}>Out of Stock</span>
            )}

            <span className={styles.sku}>SKU · {product.sku}</span>
          </div>

          {/* Quantity + Actions */}

          <div className={styles.actionRow}>
            <div className={styles.quantityBox}>
              <button type="button" onClick={decreaseQty} aria-label="Decrease quantity">
                −
              </button>
              <span>{quantity}</span>
              <button type="button" onClick={increaseQty} aria-label="Increase quantity">
                +
              </button>
            </div>

            <button className={styles.cartBtn} type="button">
              <CartIcon />
              Add to Cart
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
              <HeartIcon filled={wishlisted} />
            </button>
          </div>

          <button className={styles.buyBtn} type="button">
            Buy Now
          </button>

          {/* Perks */}

          <div className={styles.perksRow}>
            <div className={styles.perk}>
              <TruckIcon />
              <span>
                {product.freeDelivery ? "Free shipping" : "Fast shipping"}
              </span>
            </div>
            <div className={styles.perk}>
              <ReturnIcon />
              <span>
                {product.returnAvailable
                  ? `${product.returnDays || 7}-day returns`
                  : "No returns"}
              </span>
            </div>
            <div className={styles.perk}>
              <ShieldIcon />
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
                          <CheckIcon />
                          {feature}
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
                      {product.discountPrice > 0
                        ? `₹${product.discountPrice}`
                        : "-"}
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
                    <TruckIcon />
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
                    <ClockIcon />
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
                    <CashIcon />
                    <div>
                      <h4>Cash on Delivery</h4>
                      <p>{product.cashOnDelivery ? "Available" : "Not available"}</p>
                    </div>
                  </div>

                  <div className={styles.shippingItem}>
                    <BoltIcon />
                    <div>
                      <h4>Express Delivery</h4>
                      <p>{product.expressDelivery ? "Available" : "Not available"}</p>
                    </div>
                  </div>

                  <div className={styles.shippingItem}>
                    <ReturnIcon />
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
                    <RefundIcon />
                    <div>
                      <h4>Refund</h4>
                      <p>{product.refundAvailable ? "Available" : "Not available"}</p>
                    </div>
                  </div>

                  <div className={styles.shippingItem}>
                    <SwapIcon />
                    <div>
                      <h4>Replacement</h4>
                      <p>
                        {product.replacementAvailable
                          ? "Available"
                          : "Not available"}
                      </p>
                    </div>
                  </div>

                  {product.warranty && (
                    <div className={styles.shippingItem}>
                      <ShieldIcon />
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
                        <h4>{review.user?.name || "User"}</h4>
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
      </div>
    </section>
  );
}

/* ================= Inline Icons ================= */

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="6" width="14" height="12" rx="1" />
      <path d="M15 10h4l3 3v5h-7z" />
      <circle cx="6" cy="19" r="1.6" />
      <circle cx="17.5" cy="19" r="1.6" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function CashIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  );
}

function RefundIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8v8" />
      <path d="M8.5 10.5a3.5 3.5 0 1 1 0 3" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h13l-3-3" />
      <path d="M20 16H7l3 3" />
    </svg>
  );
}

function OfferIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.6 12.6 12 21.2 2.8 12 3 3l9-.2z" />
      <circle cx="8" cy="8" r="1.6" />
    </svg>
  );
}