"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Upload, Trash2 } from "lucide-react";
import axios from "axios";
import styles from "../../add/AddBanner.module.css";

export default function EditBannerPage() {
  const { id } = useParams();
  const router = useRouter();

  const API = process.env.NEXT_PUBLIC_API_URL;

  const [banner, setBanner] = useState({
    image: "",
    displayOrder: "",
    status: "Active",
  });

  const [updating, setUpdating] = useState(false);

  // ================= GET BANNER =================

  useEffect(() => {
    if (id) {
      getBanner();
    }
  }, [id]);

  const getBanner = async () => {
    try {
      const res = await axios.get(
        `${API}/api/marketing/banners/${id}`
      );

      setBanner({
        image: res.data.banner.image,
        displayOrder: res.data.banner.displayOrder,
        status: res.data.banner.status,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to load banner");
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setBanner((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // ================= UPDATE =================

  const handleUpdate = async () => {
    try {
      setUpdating(true);

      await axios.put(
        `${API}/api/marketing/banners/${id}`,
        {
          image: banner.image,
          displayOrder: Number(banner.displayOrder),
          status: banner.status,
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

  const handleDelete = async () => {
    if (!window.confirm("Delete this banner?")) return;

    try {
      await axios.delete(
        `${API}/api/marketing/banners/${id}`
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
          <Link
            href="/admin/banners"
            className={styles.back}
          >
            <ArrowLeft size={18} />
            Back to Banners
          </Link>

          <h1>Edit Banner</h1>
          <p>Update homepage banner</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.field}>
          <label>Banner Image</label>

          <label className={styles.upload}>
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
        </div>

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
