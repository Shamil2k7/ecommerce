"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./ProductDetails.module.css";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [mainImage, setMainImage] = useState("");

  const [quantity, setQuantity] = useState(1);

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

  return (
    <section className={styles.productPage}>
      <div className={styles.container}>
        <div className={styles.productWrapper}>
          {/* =========================
              Product Images
          ========================== */}

          <div className={styles.left}>

          <div className={styles.mainImageBox}>
            <img
              src={
                mainImage ||
                "/images/no-image.png"
              }
              alt={product.name}
              className={styles.mainImage}
            />
          </div>

          <div className={styles.thumbnailContainer}>
            {product.images?.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={product.name}
                className={`${styles.thumbnail}
                ${mainImage === image.url
                    ? styles.activeThumb
                    : ""
                  }`}
                onClick={() =>
                  setMainImage(image.url)
                }
              />
            ))}
          </div>

        </div>

        {/* =========================
            Product Details
        ========================== */}

        <div className={styles.right}>

          <p className={styles.brand}>
            Brand :
            <span>
              {product.brand?.name || "No Brand"}
            </span>
          </p>

          <h1 className={styles.title}>
            {product.name}
          </h1>

          <p className={styles.category}>
            Category :
            <span>
              {product.category?.name}
            </span>
          </p>

          {/* Rating */}

          <div className={styles.rating}>
            ⭐⭐⭐⭐⭐
            <span>
              ({product.ratingsCount || 0} Reviews)
            </span>
          </div>

          {/* Price */}

          <div className={styles.priceSection}>

            {product.discountPrice > 0 ? (
              <>
                <h2 className={styles.discountPrice}>
                  ₹
                  {product.discountPrice.toLocaleString()}
                </h2>

                <span className={styles.oldPrice}>
                  ₹
                  {product.price.toLocaleString()}
                </span>

                <span className={styles.save}>
                  {Math.round(
                    ((product.price -
                      product.discountPrice) /
                      product.price) *
                    100
                  )}
                  % OFF
                </span>
              </>
            ) : (
              <h2 className={styles.price}>
                ₹
                {product.price.toLocaleString()}
              </h2>
            )}

          </div>

          {/* Stock */}

          <div className={styles.stock}>

            {product.stock > 10 ? (
              <span className={styles.inStock}>
                ✔ In Stock
              </span>
            ) : product.stock > 0 ? (
              <span className={styles.lowStock}>
                Only {product.stock} Left
              </span>
            ) : (
              <span className={styles.outStock}>
                Out Of Stock
              </span>
            )}

          </div>

          {/* SKU */}

          <div className={styles.sku}>
            SKU : {product.sku}
          </div>

          {/* Quantity */}

          <div className={styles.quantitySection}>

            <h4>Quantity</h4>

            <div className={styles.quantityBox}>

              <button
                onClick={decreaseQty}
              >
                -
              </button>

              <span>{quantity}</span>

              <button
                onClick={increaseQty}
              >
                +
              </button>

            </div>

          </div>

          {/* Buttons */}

          <div className={styles.buttonGroup}>

            <button
              className={styles.cartBtn}
            >
              Add To Cart
            </button>

            <button
              className={styles.buyBtn}
            >
              Buy Now
            </button>

          </div>

          {/* Short Description */}

          {product.shortDescription && (
            <div className={styles.shortDesc}>
              <h3>Highlights</h3>

              <p>
                {product.shortDescription}
              </p>
            </div>
          )}

        </div>
        </div>
        {/* ==========================
            Description
        =========================== */}

        <div className={styles.descriptionSection}>

          <h2>Description</h2>

          <p>
            {product.description}
          </p>

        </div>

        {/* ==========================
            Specifications
        =========================== */}

        <div className={styles.specificationSection}>

          <h2>Specifications</h2>

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

            </tbody>

          </table>

        </div>

        {/* ==========================
            Reviews
        =========================== */}

        <div className={styles.reviewSection}>

          <h2>
            Customer Reviews
          </h2>

          {product.reviews?.length > 0 ? (

            product.reviews.map((review) => (

              <div
                key={review._id}
                className={styles.reviewCard}
              >

                <h4>
                  {review.user?.name || "User"}
                </h4>

                <p>
                  ⭐ {review.rating}/5
                </p>

                <p>
                  {review.comment}
                </p>

              </div>

            ))

          ) : (

            <p>No Reviews Yet.</p>

          )}

        </div>

        {/* ==========================
            Related Products
        =========================== */}

        {relatedProducts.length > 0 && (
          <div className={styles.relatedSection}>
            <h2>Related Products</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((item) => {
                const imageUrl = item.images?.[0]?.url || "/images/no-image.png";
                return (
                  <div
                    key={item._id}
                    className={styles.relatedCard}
                    onClick={() => router.push(`/products/${item._id}`)}
                  >
                    <img src={imageUrl} alt={item.name} />
                    <h4>{item.name}</h4>
                    <p>
                      {item.discountPrice > 0 ? (
                        <>
                          <span style={{ marginRight: "10px" }}>
                            ₹{item.discountPrice.toLocaleString()}
                          </span>
                          <span style={{ textDecoration: "line-through", color: "#999", fontSize: "14px", fontWeight: "normal" }}>
                            ₹{item.price.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        `₹${item.price.toLocaleString()}`
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}