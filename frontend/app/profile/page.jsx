"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./Profile.module.css";
import { User, Mail, Phone, Shield, Calendar, LogOut, Loader2, MapPin, Plus, Package, Map, Settings, X, Trash2, Edit } from "lucide-react";

export default function ProfilePage() {
  const { user, loading, logout, checkAuth } = useAuth();
  const router = useRouter();

  // Profile data states
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [addresses, setAddresses] = useState([]);

  // Modals visibility
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Address editing and addition form states
  const [addressLabel, setAddressLabel] = useState("Home");
  const [addressText, setAddressText] = useState("");
  const [editingAddressId, setEditingAddressId] = useState(null);

  // Edit profile form states
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 2500);
  };

  // Redirect to login if user session is invalid
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  // Sync profile details and address history from local storage
  useEffect(() => {
    if (user?._id) {
      const savedName = localStorage.getItem(`profile_name_${user._id}`);
      const savedPhone = localStorage.getItem(`profile_phone_${user._id}`);
      const savedAddresses = localStorage.getItem(`addresses_${user._id}`);

      setProfileName(savedName || user.fullName || "");
      setProfilePhone(savedPhone || user.phone || "");

      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses));
      } else {
        // Migrate legacy single address string to multi-address format
        const legacyAddress = localStorage.getItem(`address_${user._id}`);
        if (legacyAddress) {
          const initAddresses = [{ id: Date.now().toString(), label: "Home", text: legacyAddress }];
          setAddresses(initAddresses);
          localStorage.setItem(`addresses_${user._id}`, JSON.stringify(initAddresses));
          localStorage.removeItem(`address_${user._id}`);
        }
      }
    }
  }, [user]);

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.push("/auth/login");
    }
  };

  // Load current values when opening the edit profile modal
  const handleOpenEditModal = () => {
    setEditName(profileName);
    setEditPhone(profilePhone);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    setProfileName(editName);
    setProfilePhone(editPhone);

    if (user?._id) {
      localStorage.setItem(`profile_name_${user._id}`, editName);
      localStorage.setItem(`profile_phone_${user._id}`, editPhone);
      triggerToast("Profile updated successfully!");
    }
    setIsEditModalOpen(false);
  };

  // Edit existing address or append a new one to the list
  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressText.trim()) return;

    if (editingAddressId) {
      const updated = addresses.map((addr) =>
        addr.id === editingAddressId ? { ...addr, label: addressLabel, text: addressText } : addr
      );
      setAddresses(updated);
      if (user?._id) {
        localStorage.setItem(`addresses_${user._id}`, JSON.stringify(updated));
        triggerToast("Address saved successfully!");
      }
      setEditingAddressId(null);
    } else {
      const newAddress = {
        id: Date.now().toString(),
        label: addressLabel,
        text: addressText
      };
      const updated = [...addresses, newAddress];
      setAddresses(updated);
      if (user?._id) {
        localStorage.setItem(`addresses_${user._id}`, JSON.stringify(updated));
        triggerToast("Address saved successfully!");
      }
    }

    setAddressText("");
    setAddressLabel("Home");
  };

  const handleEditAddressClick = (addr) => {
    setEditingAddressId(addr.id);
    setAddressLabel(addr.label);
    setAddressText(addr.text);
  };

  const handleDeleteAddress = (id, label) => {
    const updated = addresses.filter((addr) => addr.id !== id);
    setAddresses(updated);
    if (user?._id) {
      localStorage.setItem(`addresses_${user._id}`, JSON.stringify(updated));
      triggerToast(`${label} Address deleted!`);
    }
    if (editingAddressId === id) {
      setEditingAddressId(null);
      setAddressText("");
      setAddressLabel("Home");
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading || !user) {
    return (
      <div className={styles.container}>
        <div className={styles.loaderWrapper}>
          <Loader2 className={styles.spin} size={40} />
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "";

  return (
    <section className={styles.container}>
      <div className={styles.profileGrid}>

        <div className={styles.leftCard}>
          <div className={styles.imageContainer}>
            <div className={styles.avatarWrapper}>
              <div className={styles.initialsAvatar}>{getInitials(profileName)}</div>
            </div>
            <h3 className={styles.userName}>{profileName}</h3>
            <p className={styles.userEmail}>{user.email}</p>
          </div>

          <div className={styles.buttonList}>
            <button className={styles.actionButton} onClick={() => router.push("/orders")}>
              <Package size={18} />
              <span>My Orders</span>
            </button>

            <button className={styles.actionButton} onClick={() => setIsAddressModalOpen(true)}>
              <Map size={18} />
              <span>Manage Addresses</span>
            </button>

            <button className={styles.actionButton} style={{ cursor: "default" }}>
              <Settings size={18} />
              <span>Settings</span>
            </button>

            <button className={`${styles.actionButton} ${styles.logoutAction}`} onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        
        <div className={styles.rightCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.sectionTitle}>Profile Details</h2>
            <button className={styles.editProfileBtn} onClick={handleOpenEditModal}>
              <Edit size={16} />
              <span>Edit Profile</span>
            </button>
          </div>

          <div className={styles.detailsList}>
            {profileName && (
              <div className={styles.detailRow}>
                <div className={styles.labelInfo}>
                  <User size={18} />
                  <span>Full Name</span>
                </div>
                <div className={styles.value}>{profileName}</div>
              </div>
            )}

            {user.email && (
              <div className={styles.detailRow}>
                <div className={styles.labelInfo}>
                  <Mail size={18} />
                  <span>Email Address</span>
                </div>
                <div className={styles.value}>{user.email}</div>
              </div>
            )}

            {profilePhone && (
              <div className={styles.detailRow}>
                <div className={styles.labelInfo}>
                  <Phone size={18} />
                  <span>Phone Number</span>
                </div>
                <div className={styles.value}>{profilePhone}</div>
              </div>
            )}

            {user.role && (
              <div className={styles.detailRow}>
                <div className={styles.labelInfo}>
                  <Shield size={18} />
                  <span>Role</span>
                </div>
                <div>
                  <span className={styles.roleBadge}>{user.role}</span>
                </div>
              </div>
            )}

            {formattedDate && (
              <div className={styles.detailRow}>
                <div className={styles.labelInfo}>
                  <Calendar size={18} />
                  <span>Joined On</span>
                </div>
                <div className={styles.value}>{formattedDate}</div>
              </div>
            )}

            {addresses.length === 0 ? (
              <div className={styles.detailRow}>
                <div className={styles.labelInfo}>
                  <MapPin size={18} />
                  <span>Delivery Addresses</span>
                </div>
                <div className={styles.emptyAddressContainer}>
                  <span className={styles.noAddressText}>No address added yet</span>
                  <button onClick={() => setIsAddressModalOpen(true)} className={styles.addAddressInlineBtn}>
                    + Add Address
                  </button>
                </div>
              </div>
            ) : (
              addresses.map((addr) => (
                <div key={addr.id} className={styles.detailRow}>
                  <div className={styles.labelInfo}>
                    <MapPin size={18} />
                    <span>{addr.label} Address</span>
                  </div>
                  <div className={styles.value}>{addr.text}</div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      
      {isEditModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Edit Profile</h3>
              <button onClick={() => setIsEditModalOpen(false)} className={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveProfile}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={styles.modalInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className={styles.modalInput}
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddressModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalLarge}>
            <div className={styles.modalHeader}>
              <h3>Manage Delivery Addresses</h3>
              <button
                onClick={() => { setIsAddressModalOpen(false); setEditingAddressId(null); setAddressText(""); }}
                className={styles.closeBtn}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.addressModalContent}>
              <div className={styles.addressSection}>
                <h4 className={styles.subModalTitle}>Saved Addresses</h4>
                {addresses.length === 0 ? (
                  <p className={styles.emptyText}>No delivery addresses saved yet.</p>
                ) : (
                  <div className={styles.addressListScroll}>
                    {addresses.map((addr) => (
                      <div key={addr.id} className={styles.savedAddressItem}>
                        <div className={styles.addrHeaderInfo}>
                          <span className={styles.addrBadge}>{addr.label}</span>
                          <div className={styles.addrItemActions}>
                            <button
                              onClick={() => handleEditAddressClick(addr)}
                              className={styles.editAddrBtn}
                              title="Edit Address"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(addr.id, addr.label)}
                              className={styles.deleteAddrBtn}
                              title="Delete Address"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <p className={styles.addrTextVal}>{addr.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <form onSubmit={handleSaveAddress} className={styles.addressForm}>
                <h4 className={styles.subModalTitle}>{editingAddressId ? "Edit Address" : "Add New Address"}</h4>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Label</label>
                  <select
                    value={addressLabel}
                    onChange={(e) => setAddressLabel(e.target.value)}
                    className={styles.modalSelect}
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Detailed Address</label>
                  <textarea
                    value={addressText}
                    onChange={(e) => setAddressText(e.target.value)}
                    placeholder="Enter street, city, state, postal code..."
                    rows="3"
                    className={styles.addressTextarea}
                    required
                  />
                </div>
                <div className={styles.addressFormButtons}>
                  <button type="submit" className={styles.addAddrBtn}>
                    <Plus size={16} />
                    <span>{editingAddressId ? "Update Address" : "Add Address"}</span>
                  </button>
                  {editingAddressId && (
                    <button
                      type="button"
                      onClick={() => { setEditingAddressId(null); setAddressText(""); setAddressLabel("Home"); }}
                      className={styles.cancelEditAddrBtn}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    
      {toastMessage && (
        <div className={styles.toastContainer}>
          <div className={styles.toast}>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </section>
  );
}