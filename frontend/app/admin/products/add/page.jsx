"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./AddProduct.module.css";
import { toast } from "react-toastify";

export default function AddProductPage() {
  const router = useRouter();

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // ===========================
  // Basic Information
  const [subcategory, setSubcategory] = useState("");
  const [category, setCategory] = useState("");

  // ===========================
  // Pricing
  // ===========================

  const [costPrice, setCostPrice] = useState("");
  const [tax, setTax] = useState("");

  // ===========================
  // Inventory
  // ===========================


  const [barcode, setBarcode] = useState("");

  // ===========================
  // Measurement
  // ===========================

  const [measurementType, setMeasurementType] = useState("");
  const [measurementValue, setMeasurementValue] = useState("");
  const [measurementUnit, setMeasurementUnit] = useState("");

  // ===========================
  // Images
  // ===========================

  const [images, setImages] = useState([]);

  // ===========================
  // Product Colors
  // ===========================

  const [colors, setColors] = useState([]);
  const [colorInput, setColorInput] = useState("");

  // ===========================
  // Product Sizes
  // ===========================

  const [sizes, setSizes] = useState([]);
  const [sizeInput, setSizeInput] = useState("");

  // ===========================
  // Features
  // ===========================

  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState("");

  // ===========================
  // Specifications
  // ===========================

  const [specifications, setSpecifications] = useState([
    {
      key: "",
      value: "",
    },
  ]);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");

  const [brand, setBrand] = useState("");

  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");

  const [stock, setStock] = useState("");
  const [sku, setSku] = useState("");

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [imageFiles, setImageFiles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // ===========================
  // Offer
  // ===========================

  const [offerEnabled, setOfferEnabled] = useState(false);
  const [offerTitle, setOfferTitle] = useState("");
  const [offerType, setOfferType] = useState("percentage");
  const [offerValue, setOfferValue] = useState("");
  const [offerStartDate, setOfferStartDate] = useState("");
  const [offerEndDate, setOfferEndDate] = useState("");

  // ===========================
  // Shipping
  // ===========================

  const [freeDelivery, setFreeDelivery] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [cashOnDelivery, setCashOnDelivery] = useState(true);
  const [expressDelivery, setExpressDelivery] = useState(false);

  // ===========================
  // Return Policy
  // ===========================

  const [returnAvailable, setReturnAvailable] = useState(true);
  const [returnDays, setReturnDays] = useState(7);
  const [refundAvailable, setRefundAvailable] = useState(true);
  const [replacementAvailable, setReplacementAvailable] = useState(true);
  const [warranty, setWarranty] = useState("");

  // ===========================
  // SEO
  // ===========================

  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  // ===========================
  // Tags
  // ===========================

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // ===========================
  // Visibility
  // ===========================

  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isActive, setIsActive] = useState(true);


  // ===========================
  // Load Categories & Brands
  // ===========================

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoryRes, brandRes] = await Promise.all([
          fetch(`${API}/api/categories`),
          fetch(`${API}/api/brands`),
        ]);

        const categoryData = await categoryRes.json();
        const brandData = await brandRes.json();

        setCategories(categoryData.data || []);
        setBrands(brandData.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    loadData();
  }, []);

 

  useEffect(() => {
    if (!name) return;

    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    setSlug(generatedSlug);
  }, [name]);

  // ===========================
  // Image Upload
  // ===========================

  const handleImageChange = (e) => {
    if (!e.target.files) return;

    setImages(Array.from(e.target.files));
  };

  // ===========================
  // Colors
  // ===========================

  const addColor = () => {
    if (!colorInput.trim()) return;

    if (colors.includes(colorInput.trim())) return;

    setColors([...colors, colorInput.trim()]);
    setColorInput("");
  };

  const removeColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  // ===========================
  // Sizes
  // ===========================

  const addSize = () => {
    if (!sizeInput.trim()) return;

    if (sizes.includes(sizeInput.trim())) return;

    setSizes([...sizes, sizeInput.trim()]);
    setSizeInput("");
  };

  const removeSize = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  // ===========================
  // Features
  // ===========================

  const addFeature = () => {
    if (!featureInput.trim()) return;

    setFeatures([...features, featureInput.trim()]);
    setFeatureInput("");
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // ===========================
  // Tags
  // ===========================

  const addTag = () => {
    if (!tagInput.trim()) return;

    setTags([...tags, tagInput.trim()]);
    setTagInput("");
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // ===========================
  // Specifications
  // ===========================

  const addSpecification = () => {
    setSpecifications([
      ...specifications,
      {
        key: "",
        value: "",
      },
    ]);
  };

  const removeSpecification = (index) => {
    setSpecifications(
      specifications.filter((_, i) => i !== index)
    );
  };

  const updateSpecification = (index, field, value) => {
    const updated = [...specifications];

    updated[index][field] = value;

    setSpecifications(updated);
  };

  // ===========================
  // Reset Form
  // ===========================

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setShortDescription("");

    setCategory("");
    setBrand("");

    setPrice("");
    setDiscountPrice("");
    setCostPrice("");
    setTax("");

    setStock("");
    setSku("");
    setBarcode("");

    setMeasurementType("");
    setMeasurementValue("");
    setMeasurementUnit("");

    setImages([]);

    setColors([]);
    setSizes([]);
    setFeatures([]);

    setSpecifications([
      {
        key: "",
        value: "",
      },
    ]);

    setTags([]);

    setOfferEnabled(false);
    setOfferTitle("");
    setOfferType("percentage");
    setOfferValue("");

    setFreeDelivery(false);
    setDeliveryCharge("");
    setEstimatedDays("");

    setReturnAvailable(true);
    setRefundAvailable(true);

    setWarranty("");

    setSeoTitle("");
    setSeoDescription("");
    setSeoKeywords("");

    setIsFeatured(false);
    setIsTrending(false);
    setIsBestSeller(false);
    setIsNewArrival(false);
    setIsActive(true);
  };
  // ===========================
  // Submit Product
  // ===========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) return toast.error("Product name is required");
    if (!category) return toast.error("Category is required");
    if (!brand) return toast.error("Brand is required");
    if (!price) return toast.error("Price is required");
    if (!description) return toast.error("Description is required");

    try {
      setLoading(true);

      const formData = new FormData();

      // ===========================
      // Basic
      // ===========================

      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("description", description);
      formData.append("shortDescription", shortDescription);

      formData.append("category", category);
      formData.append("subcategory", subcategory);
      formData.append("brand", brand);

      // ===========================
      // Pricing
      // ===========================

      formData.append("price", price);
      formData.append("discountPrice", discountPrice || 0);
      formData.append("costPrice", costPrice || 0);
      formData.append("tax", tax || 0);

      // ===========================
      // Inventory
      // ===========================

      formData.append("stock", stock);
      formData.append("sku", sku);
      formData.append("barcode", barcode);

      // ===========================
      // Measurement
      // ===========================

      formData.append("measurement[type]", measurementType);
      formData.append("measurement[value]", measurementValue);
      formData.append("measurement[unit]", measurementUnit);

      // ===========================
      // Arrays
      // ===========================

      formData.append("colors", JSON.stringify(colors));
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("features", JSON.stringify(features));
      formData.append("tags", JSON.stringify(tags));
      formData.append(
        "specifications",
        JSON.stringify(specifications)
      );

      // ===========================
      // Offer
      // ===========================

      formData.append("offerEnabled", offerEnabled);
      formData.append("offerTitle", offerTitle);
      formData.append("offerType", offerType);
      formData.append("offerValue", offerValue);
      formData.append("offerStartDate", offerStartDate);
      formData.append("offerEndDate", offerEndDate);

      // ===========================
      // Shipping
      // ===========================

      formData.append("freeDelivery", freeDelivery);
      formData.append("deliveryCharge", deliveryCharge);
      formData.append("estimatedDays", estimatedDays);
      formData.append("cashOnDelivery", cashOnDelivery);
      formData.append("expressDelivery", expressDelivery);

      // ===========================
      // Return
      // ===========================

      formData.append("returnAvailable", returnAvailable);
      formData.append("refundAvailable", refundAvailable);
      formData.append(
        "replacementAvailable",
        replacementAvailable
      );
      formData.append("returnDays", returnDays);
      formData.append("warranty", warranty);

      // ===========================
      // SEO
      // ===========================

      formData.append("seoTitle", seoTitle);
      formData.append("seoDescription", seoDescription);
      formData.append("seoKeywords", seoKeywords);

      // ===========================
      // Status
      // ===========================

      // formData.append("isFeatured", isFeatured);
      // formData.append("isTrending", isTrending);
      // formData.append("isBestSeller", isBestSeller);
      // formData.append("isNewArrival", isNewArrival);
      // formData.append("isActive", isActive);

      // ===========================
      // Images
      // ===========================

      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await fetch(`${API}/api/products`, {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type");

      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error(text);
        throw new Error("Server returned HTML instead of JSON");
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to create product.");
      }

      toast.success("Product Created Successfully");
      router.push("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className={styles.section}>
          <h2>Basic Information</h2>

          <div className={styles.grid}>

            <div className={styles.field}>
              <label>Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Apple iPhone 16 Pro"
                required
              />
            </div>

            <div className={styles.field}>
              <label>Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>Category *</label>

              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubcategory("");
                }}
                required
              >
                <option value="">Select Category</option>

                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label>Brand *</label>

              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              >
                <option value="">Select Brand</option>

                {brands.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* ===========================
    DESCRIPTION
=========================== */}

        <div className={styles.section}>

          <h2>Description</h2>

          <div className={styles.field}>
            <label>Short Description</label>

            <textarea
              rows={3}
              placeholder="Short description..."
              value={shortDescription}
              onChange={(e) =>
                setShortDescription(e.target.value)
              }
            />
          </div>

          <div className={styles.field}>
            <label>Full Description *</label>

            <textarea
              rows={8}
              placeholder="Write complete product description..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              required
            />
          </div>

        </div>

        {/* ===========================
    PRICING
=========================== */}

        <div className={styles.section}>

          <h2>Pricing</h2>

          <div className={styles.grid}>

            <div className={styles.field}>
              <label>Price *</label>

              <input
                type="number"
                value={price}
                placeholder="0"
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Discount Price</label>

              <input
                type="number"
                value={discountPrice}
                placeholder="0"
                onChange={(e) => setDiscountPrice(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>Cost Price</label>

              <input
                type="number"
                value={costPrice}
                placeholder="0"
                onChange={(e) => setCostPrice(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>Tax (%)</label>

              <input
                type="number"
                value={tax}
                placeholder="18"
                onChange={(e) => setTax(e.target.value)}
              />
            </div>

          </div>

        </div>

        {/* ===========================
    INVENTORY
=========================== */}

        <div className={styles.section}>

          <h2>Inventory</h2>

          <div className={styles.grid}>

            <div className={styles.field}>
              <label>Stock *</label>

              <input
                type="number"
                value={stock}
                placeholder="0"
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label>SKU</label>

              <input
                type="text"
                value={sku}
                placeholder="SKU-12345"
                onChange={(e) => setSku(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>Barcode</label>

              <input
                type="text"
                value={barcode}
                placeholder="Barcode"
                onChange={(e) => setBarcode(e.target.value)}
              />
            </div>

          </div>

        </div>

        {/* ===========================
    MEASUREMENT
=========================== */}

        <div className={styles.section}>

          <h2>Measurement</h2>

          <div className={styles.grid}>

            <div className={styles.field}>

              <label>Measurement Type</label>

              <select
                value={measurementType}
                onChange={(e) => setMeasurementType(e.target.value)}
              >

                <option value="">Select</option>

                <option value="weight">Weight</option>

                <option value="volume">Volume</option>

                <option value="qty">Quantity</option>

              </select>

            </div>

            <div className={styles.field}>

              <label>Value</label>

              <input
                type="number"
                value={measurementValue}
                placeholder="500"
                onChange={(e) => setMeasurementValue(e.target.value)}
              />

            </div>

            <div className={styles.field}>

              <label>Unit</label>

              <select
                value={measurementUnit}
                onChange={(e) => setMeasurementUnit(e.target.value)}
              >

                <option value="">Select Unit</option>

                <option value="g">Gram (g)</option>

                <option value="kg">Kilogram (kg)</option>

                <option value="ml">Millilitre (ml)</option>

                <option value="l">Litre (L)</option>

                <option value="pcs">Pieces</option>

                <option value="box">Box</option>

                <option value="packet">Packet</option>

                <option value="bottle">Bottle</option>

              </select>

            </div>

          </div>

        </div>

        {/* ===========================
    IMAGE UPLOAD
=========================== */}

        <div className={styles.section}>

          <h2>Product Images</h2>

          <div className={styles.field}>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />

          </div>

          {images.length > 0 && (

            <div className={styles.imageCount}>

              Selected Images : {images.length}

            </div>

          )}

        </div>
        {/* ===========================
      COLORS
=========================== */}

        <div className={styles.section}>

          <h2>Product Colors</h2>

          <div className={styles.row}>

            <input
              type="text"
              placeholder="Enter color (Red)"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
            />

            <button
              type="button"
              className={styles.addBtn}
              onClick={addColor}
            >
              + Add
            </button>

          </div>

          <div className={styles.tags}>

            {colors.map((color, index) => (

              <div
                key={index}
                className={styles.tag}
              >
                {color}

                <button
                  type="button"
                  onClick={() => removeColor(index)}
                >
                  ✕
                </button>

              </div>

            ))}

          </div>

        </div>

        {/* ===========================
      SIZES
=========================== */}

        <div className={styles.section}>

          <h2>Available Sizes</h2>

          <div className={styles.row}>

            <input
              type="text"
              placeholder="XL / Large / 42"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
            />

            <button
              type="button"
              className={styles.addBtn}
              onClick={addSize}
            >
              + Add
            </button>

          </div>

          <div className={styles.tags}>

            {sizes.map((size, index) => (

              <div
                key={index}
                className={styles.tag}
              >
                {size}

                <button
                  type="button"
                  onClick={() => removeSize(index)}
                >
                  ✕
                </button>

              </div>

            ))}

          </div>

        </div>

        {/* ===========================
      FEATURES
=========================== */}

        <div className={styles.section}>

          <h2>Product Features</h2>

          <div className={styles.row}>

            <input
              type="text"
              placeholder="Fast Charging"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
            />

            <button
              type="button"
              className={styles.addBtn}
              onClick={addFeature}
            >
              + Add
            </button>

          </div>

          <div className={styles.tags}>

            {features.map((feature, index) => (

              <div
                key={index}
                className={styles.tag}
              >
                {feature}

                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                >
                  ✕
                </button>

              </div>

            ))}

          </div>

        </div>

        {/* ===========================
      SPECIFICATIONS
=========================== */}

        <div className={styles.section}>

          <h2>Specifications</h2>

          {specifications.map((spec, index) => (

            <div
              key={index}
              className={styles.specificationRow}
            >

              <input
                type="text"
                placeholder="Key"
                value={spec.key}
                onChange={(e) =>
                  updateSpecification(
                    index,
                    "key",
                    e.target.value
                  )
                }
              />

              <input
                type="text"
                placeholder="Value"
                value={spec.value}
                onChange={(e) =>
                  updateSpecification(
                    index,
                    "value",
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                className={styles.removeBtn}
                onClick={() =>
                  removeSpecification(index)
                }
              >
                Remove
              </button>

            </div>

          ))}

          <button
            type="button"
            className={styles.addBtn}
            onClick={addSpecification}
          >
            + Add Specification
          </button>

        </div>

        {/* ===========================
      TAGS
=========================== */}

        <div className={styles.section}>

          <h2>Product Tags</h2>

          <div className={styles.row}>

            <input
              type="text"
              placeholder="electronics"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />

            <button
              type="button"
              className={styles.addBtn}
              onClick={addTag}
            >
              + Add
            </button>

          </div>

          <div className={styles.tags}>

            {tags.map((tag, index) => (

              <div
                key={index}
                className={styles.tag}
              >
                {tag}

                <button
                  type="button"
                  onClick={() => removeTag(index)}
                >
                  ✕
                </button>

              </div>

            ))}

          </div>

        </div>
        {/* ===========================
        OFFER SETTINGS
=========================== */}

        <div className={styles.section}>
          <h2>🎁 Offer Settings</h2>

          <label className={styles.switchRow}>
            <input
              type="checkbox"
              checked={offerEnabled}
              onChange={(e) => setOfferEnabled(e.target.checked)}
            />
            Enable Offer
          </label>

          {offerEnabled && (
            <div className={styles.grid}>

              <div className={styles.field}>
                <label>Offer Title</label>
                <input
                  type="text"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  placeholder="Summer Sale"
                />
              </div>

              <div className={styles.field}>
                <label>Offer Type</label>

                <select
                  value={offerType}
                  onChange={(e) => setOfferType(e.target.value)}
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div className={styles.field}>
                <label>Offer Value</label>

                <input
                  type="number"
                  value={offerValue}
                  onChange={(e) => setOfferValue(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label>Start Date</label>

                <input
                  type="date"
                  value={offerStartDate}
                  onChange={(e) => setOfferStartDate(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label>End Date</label>

                <input
                  type="date"
                  value={offerEndDate}
                  onChange={(e) => setOfferEndDate(e.target.value)}
                />
              </div>

            </div>
          )}
        </div>

        {/* ===========================
        SHIPPING
=========================== */}

        <div className={styles.section}>

          <h2>🚚 Shipping</h2>

          <div className={styles.grid}>

            <label className={styles.switchRow}>
              <input
                type="checkbox"
                checked={freeDelivery}
                onChange={(e) => setFreeDelivery(e.target.checked)}
              />
              Free Delivery
            </label>

            <label className={styles.switchRow}>
              <input
                type="checkbox"
                checked={cashOnDelivery}
                onChange={(e) => setCashOnDelivery(e.target.checked)}
              />
              Cash On Delivery
            </label>

            <label className={styles.switchRow}>
              <input
                type="checkbox"
                checked={expressDelivery}
                onChange={(e) => setExpressDelivery(e.target.checked)}
              />
              Express Delivery
            </label>

            <div className={styles.field}>
              <label>Delivery Charge</label>

              <input
                type="number"
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className={styles.field}>
              <label>Estimated Delivery (Days)</label>

              <input
                type="number"
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(e.target.value)}
                placeholder="3"
              />
            </div>

          </div>

        </div>

        {/* ===========================
      RETURN & REFUND
=========================== */}

        <div className={styles.section}>

          <h2>🔄 Return & Refund</h2>

          <div className={styles.grid}>

            <label className={styles.switchRow}>
              <input
                type="checkbox"
                checked={returnAvailable}
                onChange={(e) => setReturnAvailable(e.target.checked)}
              />
              Return Available
            </label>

            <label className={styles.switchRow}>
              <input
                type="checkbox"
                checked={refundAvailable}
                onChange={(e) => setRefundAvailable(e.target.checked)}
              />
              Refund Available
            </label>

            <label className={styles.switchRow}>
              <input
                type="checkbox"
                checked={replacementAvailable}
                onChange={(e) => setReplacementAvailable(e.target.checked)}
              />
              Replacement Available
            </label>

            <div className={styles.field}>
              <label>Return Days</label>

              <input
                type="number"
                value={returnDays}
                onChange={(e) => setReturnDays(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>Warranty</label>

              <input
                type="text"
                placeholder="1 Year"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
              />
            </div>

          </div>

        </div>



        {/* ===========================
          ACTION BUTTONS
=========================== */}

        <div className={styles.actions}>

          <button
            type="button"
            className={styles.secondary}
            onClick={() => router.push("/admin/products")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={styles.primary}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Product"}
          </button>

        </div>
      </form>
    </div>
  )
}