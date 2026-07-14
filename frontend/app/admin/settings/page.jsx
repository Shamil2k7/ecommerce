"use client";

import { useState } from "react";
import styles from "./Settings.module.css";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    storeName: "My Store",
    email: "admin@example.com",
    phone: "+91 9876543210",
    address: "Kochi, Kerala",
    currency: "INR",
    timezone: "Asia/Kolkata",
    tax: "18",
    shipping: "100",
    maintenance: false,
    emailNotification: true,
  });

  const handleChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1>Settings</h1>
        <p>Manage your store settings</p>
      </div>

      <form className={styles.form}>
        {/* Store Information */}

        <div className={styles.card}>
          <h2>Store Information</h2>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Store Name</label>

              <input
                value={settings.storeName}
                onChange={(e) =>
                  handleChange("storeName", e.target.value)
                }
              />
            </div>

            <div className={styles.field}>
              <label>Email</label>

              <input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  handleChange("email", e.target.value)
                }
              />
            </div>

            <div className={styles.field}>
              <label>Phone</label>

              <input
                value={settings.phone}
                onChange={(e) =>
                  handleChange("phone", e.target.value)
                }
              />
            </div>

            <div className={styles.field}>
              <label>Address</label>

              <input
                value={settings.address}
                onChange={(e) =>
                  handleChange("address", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Store Settings */}

        <div className={styles.card}>
          <h2>Store Settings</h2>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Currency</label>

              <select
                value={settings.currency}
                onChange={(e) =>
                  handleChange("currency", e.target.value)
                }
              >
                <option>INR</option>
                <option>USD</option>
                <option>AED</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Timezone</label>

              <select
                value={settings.timezone}
                onChange={(e) =>
                  handleChange("timezone", e.target.value)
                }
              >
                <option>Asia/Kolkata</option>
                <option>Asia/Dubai</option>
                <option>UTC</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Tax (%)</label>

              <input
                type="number"
                value={settings.tax}
                onChange={(e) =>
                  handleChange("tax", e.target.value)
                }
              />
            </div>

            <div className={styles.field}>
              <label>Shipping Charge</label>

              <input
                type="number"
                value={settings.shipping}
                onChange={(e) =>
                  handleChange("shipping", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Preferences */}

        <div className={styles.card}>
          <h2>Preferences</h2>

          <div className={styles.switchRow}>
            <label>Email Notifications</label>

            <input
              type="checkbox"
              checked={settings.emailNotification}
              onChange={(e) =>
                handleChange(
                  "emailNotification",
                  e.target.checked
                )
              }
            />
          </div>

          <div className={styles.switchRow}>
            <label>Maintenance Mode</label>

            <input
              type="checkbox"
              checked={settings.maintenance}
              onChange={(e) =>
                handleChange(
                  "maintenance",
                  e.target.checked
                )
              }
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button type="reset" className={styles.cancel}>
            Cancel
          </button>

          <button type="submit" className={styles.save}>
            Save Settings
          </button>
        </div>
      </form>
    </section>
  );
}