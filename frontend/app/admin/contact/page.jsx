"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Contact.module.css";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AdminContactPage() {
    const [contact, setContact] = useState({
        storeName: "",
        email: "",
        phone: "",
        address: "",
        workingHours: "",
        map: "",
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: "",
    });

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchContact();
        fetchMessages();
    }, []);

    const deleteMessage = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this message?"
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            const { data } = await axios.delete(
                `${API}/api/contact/messages/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            if (data.success) {
                setMessages((prev) =>
                    prev.filter((msg) => msg._id !== id)
                );

                alert("Message deleted successfully");
            }
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Failed to delete message"
            );
        }
    };

    const fetchContact = async () => {
        try {
            const token = localStorage.getItem("token");

            const { data } = await axios.get(
                `${API}/api/contact`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            if (data.success && data.contact) {
                setContact(data.contact);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem("token");

            const { data } = await axios.get(
                `${API}/api/contact/messages`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            if (data.success) {
                setMessages(data.messages);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        setContact({
            ...contact,
            [e.target.name]: e.target.value,
        });
    };

    const saveContact = async () => {
        try {
            setSaving(true);

            const token = localStorage.getItem("token");

            const { data } = await axios.put(
                `${API}/api/contact`,
                contact,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            alert(data.message);
        } catch (err) {
            alert(err.response?.data?.message || "Update failed");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <h2 style={{ padding: 30 }}>Loading...</h2>;
    }

    return (
        <section className={styles.container}>
            <h1>Contact Settings</h1>

            <div className={styles.form}>
                <input
                    name="storeName"
                    placeholder="Store Name"
                    value={contact.storeName}
                    onChange={handleChange}
                />

                <input
                    name="email"
                    placeholder="Email"
                    value={contact.email}
                    onChange={handleChange}
                />

                <input
                    name="phone"
                    placeholder="Phone"
                    value={contact.phone}
                    onChange={handleChange}
                />

                <textarea
                    name="address"
                    placeholder="Address"
                    value={contact.address}
                    onChange={handleChange}
                />

                <input
                    name="workingHours"
                    placeholder="Working Hours"
                    value={contact.workingHours}
                    onChange={handleChange}
                />

                <input
                    name="facebook"
                    placeholder="Facebook"
                    value={contact.facebook}
                    onChange={handleChange}
                />

                <input
                    name="instagram"
                    placeholder="Instagram"
                    value={contact.instagram}
                    onChange={handleChange}
                />

                <input
                    name="twitter"
                    placeholder="Twitter"
                    value={contact.twitter}
                    onChange={handleChange}
                />

                <input
                    name="linkedin"
                    placeholder="LinkedIn"
                    value={contact.linkedin}
                    onChange={handleChange}
                />

                <textarea
                    name="map"
                    placeholder="Google Maps Embed URL"
                    value={contact.map}
                    onChange={handleChange}
                />

                <button
                    onClick={saveContact}
                    disabled={saving}
                    className={styles.saveBtn}
                >
                    {saving ? "Saving..." : "Save Contact"}
                </button>
            </div>

            <hr />

            <h2>Contact Messages</h2>

            <div className={styles.tableWrapper}>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Message</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {messages.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center" }}>
                                    No Messages
                                </td>
                            </tr>
                        ) : (
                            messages.map((msg) => (
                                <tr key={msg._id}>
                                    <td>{msg.name}</td>
                                    <td>{msg.email}</td>
                                    <td>{msg.subject}</td>
                                    <td>{msg.message}</td>
                                    <td>
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => deleteMessage(msg._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}