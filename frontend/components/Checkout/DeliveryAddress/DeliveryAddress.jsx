import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import styles from "./DeliveryAddress.module.css";

export default function DeliveryAddress({
  addresses,
  setAddresses,
  selectedAddress,
  setSelectedAddress,
}) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/auth`;

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    label: "Home",
    text: "",
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/addresses`, {
        credentials: "include",
      });

      const result = await response.json();

      if (!result.success) return;

      setAddresses(result.addresses || []);

      if (result.addresses?.length) {
        setSelectedAddress(result.addresses[0]._id);
      }
    } catch (error) {
      console.error("Unable to load addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.text.trim()) return;

    const isEditing = Boolean(editingId);

    try {
      const response = await fetch(
        isEditing
          ? `${API_URL}/addresses/${editingId}`
          : `${API_URL}/addresses`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!result.success) return;

      if (isEditing) {
        setAddresses((prev) =>
          prev.map((item) =>
            item._id === editingId ? result.address : item
          )
        );
      } else {
        setAddresses((prev) => [...prev, result.address]);
      }

      setSelectedAddress(result.address._id);
      resetForm();
    } catch (error) {
      console.error("Failed to save address:", error);
    }
  };

  const handleEdit = (e, address) => {
    e.stopPropagation();

    setEditingId(address._id);

    setFormData({
      label: address.label,
      text: address.text,
    });

    setShowForm(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/addresses/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();

      if (!result.success) return;

      const updatedAddresses = addresses.filter(
        (address) => address._id !== id
      );

      setAddresses(updatedAddresses);

      if (selectedAddress === id) {
        setSelectedAddress(updatedAddresses[0]?._id || null);
      }
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      label: "Home",
      text: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.cardHeader}>
        <h2>Delivery Address</h2>

        {!showForm && (
          <button
            className={styles.addBtn}
            onClick={() => setShowForm(true)}
          >
            + Add New
          </button>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <p className={styles.loadingText}>Loading addresses...</p>
      ) : (
        <div className={styles.addressList}>
          {addresses.length === 0 ? (
            !showForm && (
              <p className={styles.noAddressText}>
                No saved addresses found. Please add one.
              </p>
            )
          ) : (
            addresses.map((address) => (
              <div
                key={address._id}
                className={`${styles.addressItem} ${
                  selectedAddress === address._id ? styles.selected : ""
                }`}
                onClick={() => setSelectedAddress(address._id)}
              >
                {/* Radio */}
                <div className={styles.radioWrapper}>
                  <input
                    type="radio"
                    checked={selectedAddress === address._id}
                    onChange={() =>
                      setSelectedAddress(address._id)
                    }
                  />
                </div>

                {/* Address */}
                <div className={styles.addressDetails}>
                  <div className={styles.addressContent}>
                    <span className={styles.addressLabel}>
                      {address.label}
                    </span>

                    <p className={styles.addressText}>
                      {address.text}
                    </p>
                  </div>

                  {/* Right Side Actions */}
                  <div className={styles.addressActions}>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={(e) => handleEdit(e, address)}
                      title="Edit Address"
                    >
                      <FiEdit2 size={18} />
                    </button>

                    <button
                      type="button"
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={(e) =>
                        handleDelete(e, address._id)
                      }
                      title="Delete Address"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className={styles.addressForm}
        >
          <div className={styles.formGroup}>
            <label>Label</label>

            <select
              value={formData.label}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  label: e.target.value,
                })
              }
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Full Address</label>

            <textarea
              rows={4}
              required
              placeholder="Enter your complete address"
              value={formData.text}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  text: e.target.value,
                })
              }
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={resetForm}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.saveBtn}
            >
              {editingId ? "Update Address" : "Save Address"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}