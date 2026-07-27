"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Upload, Trash2 } from "lucide-react";
import axios from "axios";
import styles from "./EditBanner.module.css";

export default function EditBannerPage() {
  const { id } = useParams();
  const router = useRouter();

  const API = process.env.NEXT_PUBLIC_API_URL;
  const [errors, setErrors] = useState({
    image: "",
  });
  const [banner, setBanner] = useState({
    image: "",
    displayOrder: "",
    status: "Active",
  });

  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      getBanner();
    }
  }, [id]);

 const getBanner = async () => {
  try {
    const response = await axios.get(
      `${API}/api/marketing/banners/${id}`,
      {
        withCredentials: true,
      }
    );

    const bannerData = response.data.banner;

    if (!bannerData) {
      alert("Banner not found");
      router.push("/admin/banners");
      return;
    }

    setBanner({
      image: bannerData.image,
      displayOrder: bannerData.displayOrder,
      status: bannerData.status,
    });
  } catch (err) {
    console.error("Error loading banner:", err);

    alert(
      err.response?.data?.message ||
      "Unable to load banner."
    );
  }
};


  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Clear previous error
    setErrors({
      image: "",
    });

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors({
        image: "Please select a valid image file.",
      });
      return;
    }

    const image = new Image();
    const imageURL = URL.createObjectURL(file);

    image.onload = () => {
      // Validate dimensions
      if (image.width < 1600 || image.height < 500) {
        setErrors({
          image: `Selected image is ${image.width} × ${image.height}px.\nMinimum required size is 1600 × 500 pixels.`,
        });

        URL.revokeObjectURL(imageURL);
        return;
      }

      // Convert image to Base64
      const reader = new FileReader();

      reader.onloadend = () => {
        setBanner((prev) => ({
          ...prev,
          image: reader.result,
        }));

        setErrors({
          image: "",
        });
      };

      reader.readAsDataURL(file);

      URL.revokeObjectURL(imageURL);
    };

    image.onerror = () => {
      setErrors({
        image: "Invalid image file.",
      });

      URL.revokeObjectURL(imageURL);
    };

    image.src = imageURL;
  };
  // Update banner
  const handleUpdate = async () => {
    if (errors.image) {
      alert(errors.image);
      return;
    }

    try {
      setUpdating(true);

      await axios.put(
        `${API}/api/marketing/banners/${id}`,
        {
          image: banner.image,
          displayOrder: Number(banner.displayOrder),
          status: banner.status,
        },
        {
          withCredentials: true,
        }
      );

      alert("Banner updated successfully");
      router.push("/admin/banners");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };
  // Delete banner
  const handleDelete = async () => {
    if (!window.confirm("Delete this banner?")) return;

    try {
      await axios.delete(
        `${API}/api/marketing/banners/${id}`,
        {
          withCredentials: true,
        }
      );

      alert("Banner deleted successfully");
      router.push("/admin/banners");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <Link href="/admin/banners" className={styles.back}>
            <ArrowLeft size={18} />
            Back to Banners
          </Link>

          <h1>Edit Banner</h1>
          <p>Update homepage banner</p>
        </div>
      </div>

      <div className={styles.card}>
        {/* Banner Image */}
        <div className={styles.field}>
          <div className={styles.imageHeader}>
            <label>Banner Image</label>

            <button
              type="button"
              className={styles.infoBtn}
              onClick={() =>
                alert(
                  "Banner Image Requirements\n\n" +
                  "• Minimum Size: 1920 × 600 pixels\n" +
                  "• Recommended Size: 1920 × 600 pixels\n" +
                  "• Aspect Ratio: 16:5\n" +
                  "• Formats: JPG, PNG, WebP\n" +
                  "• Maximum File Size: 2 MB"
                )
              }
            >
              Image Requirements
            </button>
          </div>

          <label
            className={`${styles.upload} ${errors.image ? styles.errorUpload : ""
              }`}
          >
            {banner.image && (
              <img
                src={banner.image}
                alt="Banner"
              />
            )}

            <div className={styles.overlay}>
              <Upload size={24} />
              <span>Change Image</span>
            </div>

            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handleImage}
            />
          </label>

          {errors.image && (
            <p className={styles.error}>
              {errors.image}
            </p>
          )}
        </div>

        {/* Display Order */}
        <div className={styles.field}>
          <label>Display Order</label>

          <input
            type="number"
            value={banner.displayOrder}
            onChange={(e) =>
              setBanner({
                ...banner,
                displayOrder: e.target.value,
              })
            }
          />
        </div>

        {/* Status */}
        <div className={styles.field}>
          <label>Status</label>

          <select
            value={banner.status}
            onChange={(e) =>
              setBanner({
                ...banner,
                status: e.target.value,
              })
            }
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Buttons */}
        <div className={styles.buttons}>
          <button
            className={styles.delete}
            onClick={handleDelete}
            disabled={updating}
          >
            <Trash2 size={18} />
            Delete
          </button>

          <button
            className={styles.cancel}
            onClick={() => router.push("/admin/banners")}
            disabled={updating}
          >
            Cancel
          </button>

          <button
            className={styles.save}
            onClick={handleUpdate}
            disabled={updating}
          >
            {updating ? "Updating..." : "Update Banner"}
          </button>
        </div>
      </div>
    </section>
  );
}