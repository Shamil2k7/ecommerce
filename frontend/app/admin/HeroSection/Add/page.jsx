"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, Upload } from "lucide-react";
import styles from "./addHero.module.css";

export default function AddHeroSection() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    const [hero, setHero] = useState({
        brand: "",
        offer: "",
        subOffer: "",
        image: "",
        displayOrder: 1,
        status: "Active",
    });

    const [errors, setErrors] = useState({});


    // Image Upload
    const handleImage = (e) => {
        const file = e.target.files[0];

        if (!file) return;


        // Condition 1: Only image files
        if (!file.type.startsWith("image/")) {
            setErrors((prev) => ({
                ...prev,
                image: "Only image files are allowed",
            }));
            return;
        }


        // Condition 2: Max 5MB
        if (file.size > 5 * 1024 * 1024) {
            setErrors((prev) => ({
                ...prev,
                image: "Image size must be less than 5MB",
            }));
            return;
        }


        const img = new Image();


        img.onload = () => {

            // Condition 3: Image dimensions
            if (img.width < 1600 || img.height < 500) {
                setErrors((prev) => ({
                    ...prev,
                    image:
                        "Banner image should be minimum 1600x500 pixels",
                }));

                return;
            }


            // Preview
            setPreview(URL.createObjectURL(file));


            // Convert to Base64
            const reader = new FileReader();

            reader.readAsDataURL(file);


            reader.onloadend = () => {

                setHero((prev) => ({
                    ...prev,
                    image: reader.result,
                }));


                setErrors((prev) => ({
                    ...prev,
                    image: "",
                }));
            };
        
        };
        img.src = URL.createObjectURL(file);
    };


    // Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;


        setHero((prev) => ({
            ...prev,
            [name]:
                name === "displayOrder"
                    ? Number(value)
                    : value,
        }));


        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };



    // Validation
    const validate = () => {
        const newErrors = {};

        if (!hero.brand.trim()) {
            newErrors.brand = "Brand is required";
        }

        if (!hero.image) {
            newErrors.image = "Hero image is required";
        }

        if (hero.displayOrder < 1) {
            newErrors.displayOrder =
                "Display Order must be greater than 0";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };// Submit
   // Submit
const handleSubmit = async () => {
    if (!validate()) return;

    try {
        setLoading(true);

        const API = process.env.NEXT_PUBLIC_API_URL;

        if (!API) {
            alert("NEXT_PUBLIC_API_URL is not defined.");
            return;
        }

        const { data } = await axios.post(
            `${API}/api/marketing/hero-sections`,
            {
                brand: hero.brand.trim(),
                image: hero.image,
                displayOrder: Number(hero.displayOrder),
                status: hero.status,
            }
        );

        alert(data.message);

        router.push("/admin/HeroSection");

    } catch (err) {
        console.error(err);

        alert(
            err.response?.data?.message ||
            err.message ||
            "Failed to create hero section."
        );
    } finally {
        setLoading(false);
    }
};
    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <Link
                    href="/admin/HeroSection"
                    className={styles.backBtn}
                >
                    <ArrowLeft size={18} />
                    Back to Hero Sections
                </Link>
                <h1 className={styles.title}>
                    Add Hero Section
                </h1>
                <p className={styles.subtitle}>
                    Create a new Hero Banner.
                </p>

            </div>
            <div className={styles.formCard}>
                <div className={styles.formGroup}>
                    <label>Brand</label>

                    <input
                        className={styles.input}
                        type="text"
                        name="brand"
                        value={hero.brand}
                        onChange={handleChange}
                        placeholder="Enter Brand"
                    />

                    {errors.brand &&
                        <p className={styles.error}>
                            {errors.brand}
                        </p>}

                </div>
                {/* <div className={styles.formGroup}>
                    <label>Offer</label>

                    <input
                        className={styles.input}
                        type="text"
                        name="offer"
                        value={hero.offer}
                        onChange={handleChange}
                        placeholder="Enter Offer"
                    />

                    {errors.offer &&
                        <p className={styles.error}>
                            {errors.offer}
                        </p>}

                </div> */}
                {/* <div className={styles.formGroup}>
                    <label>Sub Offer</label>

                    <input
                        className={styles.input}
                        type="text"
                        name="subOffer"
                        value={hero.subOffer}
                        onChange={handleChange}
                        placeholder="Enter Sub Offer"
                    />
                    {errors.subOffer &&
                        <p className={styles.error}>
                            {errors.subOffer}
                        </p>}
                </div> */}
                <div className={styles.formGroup}>
                    <label>Hero Image</label>
                    <label className={styles.uploadBox}>
                        {preview ? (

                            <img
                                src={preview}
                                alt="Preview"
                            />
                        ) : (

                            <>
                                <Upload size={40} />
                                <span>
                                    Upload Hero Image
                                </span>
                            </>
                        )}
                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={handleImage}
                        />
                    </label>
                    {errors.image &&
                        <p className={styles.error}>
                            {errors.image}
                        </p>}
                </div>
                <div className={styles.formGroup}>
                    <label>Display Order</label>
                    <input
                        className={styles.input}
                        type="number"
                        min="1"
                        name="displayOrder"
                        value={hero.displayOrder}
                        onChange={handleChange}
                    />
                    {errors.displayOrder &&
                        <p className={styles.error}>
                            {errors.displayOrder}
                        </p>}
                </div>
                <div className={styles.formGroup}>
                    <label>Status</label>
                    <select
                        className={styles.select}
                        name="status"
                        value={hero.status}
                        onChange={handleChange}
                    >
                        <option value="Active">
                            Active
                        </option>
                        <option value="Inactive">
                            Inactive
                        </option>
                    </select>
                </div>
                <div className={styles.buttonGroup}>
                    <button
                        className={styles.cancelBtn}
                        onClick={() =>
                            router.push("/admin/HeroSection")
                        }
                    >
                        Cancel
                    </button>
                    <button
                        className={styles.saveBtn}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : "Save Hero Section"}
                    </button>
                </div>
            </div>
        </section>
    );
}