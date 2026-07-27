"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./About.module.css";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AdminAboutPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState({});

    const [about, setAbout] = useState({
        title: "",
        subtitle: "",
        description: "",
        heroImage: "",

        storyTitle: "",
        storyDescription: "",
        storyImage: "",

        mission: "",
        vision: "",

        ctaTitle: "",
        ctaDescription: "",
        ctaButtonText: "",
        ctaButtonLink: "",

        stats: [],
        features: [],
        team: [],
    });

    useEffect(() => {
        fetchAbout();
    }, []);

    // ================= IMAGE UPLOAD =================

    const uploadFile = async (file) => {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("image", file);

        const { data } = await axios.post(
           `${API}/api/about/image`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            }
        );

        return data.url;
    };

    const handleSingleImageUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading((prev) => ({ ...prev, [field]: true }));

        try {
            const url = await uploadFile(file);
            setAbout((prev) => ({ ...prev, [field]: url }));
        } catch (err) {
            alert(err.response?.data?.message || "Image upload failed");
        } finally {
            setUploading((prev) => ({ ...prev, [field]: false }));
        }
    };

    const handleTeamImageUpload = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        const key = `team-${index}`;
        setUploading((prev) => ({ ...prev, [key]: true }));

        try {
            const url = await uploadFile(file);
            updateTeam(index, "image", url);
        } catch (err) {
            alert(err.response?.data?.message || "Image upload failed");
        } finally {
            setUploading((prev) => ({ ...prev, [key]: false }));
        }
    };

    // ================= FEATURES =================

    const addFeature = () => {
        setAbout({
            ...about,
            features: [
                ...about.features,
                {
                    title: "",
                    description: "",
                    icon: "⭐",
                },
            ],
        });
    };

    const updateFeature = (index, field, value) => {
        const updated = [...about.features];
        updated[index][field] = value;

        setAbout({
            ...about,
            features: updated,
        });
    };

    const deleteFeature = (index) => {
        setAbout({
            ...about,
            features: about.features.filter((_, i) => i !== index),
        });
    };

    // ================= STATS =================

    const addStat = () => {
        setAbout({
            ...about,
            stats: [
                ...about.stats,
                {
                    value: "",
                    label: "",
                },
            ],
        });
    };

    const updateStat = (index, field, value) => {
        const updated = [...about.stats];
        updated[index][field] = value;

        setAbout({
            ...about,
            stats: updated,
        });
    };

    const deleteStat = (index) => {
        setAbout({
            ...about,
            stats: about.stats.filter((_, i) => i !== index),
        });
    };

    // ================= TEAM =================

    const addTeamMember = () => {
        setAbout({
            ...about,
            team: [
                ...about.team,
                {
                    image: "",
                    name: "",
                    position: "",
                    description: "",
                },
            ],
        });
    };

    const updateTeam = (index, field, value) => {
        const updated = [...about.team];
        updated[index][field] = value;

        setAbout({
            ...about,
            team: updated,
        });
    };

    const deleteTeam = (index) => {
        setAbout({
            ...about,
            team: about.team.filter((_, i) => i !== index),
        });
    };

    const fetchAbout = async () => {
        try {
            const token = localStorage.getItem("token");

            const { data } = await axios.get(
                `${API}/api/about`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            if (data.success) {
                setAbout((prev) => ({ ...prev, ...data.about }));
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setAbout({
            ...about,
            [e.target.name]: e.target.value,
        });
    };

    const saveAbout = async () => {
        try {
            setSaving(true);

            const token = localStorage.getItem("token");

            const { data } = await axios.put(
                `${API}/api/about`,
                about,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            alert(data.message);
        } catch (err) {
            alert(
                err.response?.data?.message || "Failed to save"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                Loading...
            </div>
        );
    }

    return (
        <section className={styles.container}>
            <h1>About Page Settings</h1>

            {/* ================= HERO ================= */}

            <div className={styles.card}>
                <h2>Hero Section</h2>

                <div className={styles.formGrid}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Page Title"
                        value={about.title}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="subtitle"
                        placeholder="Subtitle"
                        value={about.subtitle}
                        onChange={handleChange}
                    />

                    <textarea
                        name="description"
                        rows={5}
                        placeholder="Description"
                        value={about.description}
                        onChange={handleChange}
                    />

                    <label className={styles.fileLabel}>
                        Hero Image
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSingleImageUpload(e, "heroImage")}
                        />
                    </label>

                    {uploading.heroImage && (
                        <p className={styles.uploadingText}>Uploading...</p>
                    )}

                    {about.heroImage && (
                        <img
                            src={about.heroImage}
                            alt="Hero preview"
                            className={styles.imagePreview}
                        />
                    )}
                </div>
            </div>

            {/* ================= STORY ================= */}

            <div className={styles.card}>
                <h2>Our Story</h2>

                <div className={styles.formGrid}>
                    <input
                        type="text"
                        name="storyTitle"
                        placeholder="Story Title"
                        value={about.storyTitle}
                        onChange={handleChange}
                    />

                    <textarea
                        rows={8}
                        name="storyDescription"
                        placeholder="Story Description"
                        value={about.storyDescription}
                        onChange={handleChange}
                    />

                    <label className={styles.fileLabel}>
                        Story Image
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSingleImageUpload(e, "storyImage")}
                        />
                    </label>

                    {uploading.storyImage && (
                        <p className={styles.uploadingText}>Uploading...</p>
                    )}

                    {about.storyImage && (
                        <img
                            src={about.storyImage}
                            alt="Story preview"
                            className={styles.imagePreview}
                        />
                    )}
                </div>
            </div>

            {/* ================= MISSION ================= */}

            <div className={styles.card}>
                <h2>Mission & Vision</h2>

                <div className={styles.formGrid}>
                    <textarea
                        rows={6}
                        name="mission"
                        placeholder="Mission"
                        value={about.mission}
                        onChange={handleChange}
                    />

                    <textarea
                        rows={6}
                        name="vision"
                        placeholder="Vision"
                        value={about.vision}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {/* ================= FEATURES ================= */}

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2>Features</h2>

                    <button
                        type="button"
                        className={styles.addBtn}
                        onClick={addFeature}
                    >
                        + Add Feature
                    </button>
                </div>

                {about.features.length === 0 && (
                    <p className={styles.empty}>No features added.</p>
                )}

                {about.features.map((feature, index) => (
                    <div key={index} className={styles.itemCard}>
                        <input
                            type="text"
                            placeholder="Icon (emoji)"
                            value={feature.icon}
                            onChange={(e) =>
                                updateFeature(index, "icon", e.target.value)
                            }
                        />

                        <input
                            type="text"
                            placeholder="Feature Title"
                            value={feature.title}
                            onChange={(e) =>
                                updateFeature(index, "title", e.target.value)
                            }
                        />

                        <textarea
                            rows={3}
                            placeholder="Feature Description"
                            value={feature.description}
                            onChange={(e) =>
                                updateFeature(index, "description", e.target.value)
                            }
                        />

                        <button
                            type="button"
                            className={styles.deleteBtn}
                            onClick={() => deleteFeature(index)}
                        >
                            Delete Feature
                        </button>
                    </div>
                ))}
            </div>

            {/* ================= STATS ================= */}

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2>Statistics</h2>

                    <button
                        type="button"
                        className={styles.addBtn}
                        onClick={addStat}
                    >
                        + Add Statistic
                    </button>
                </div>

                {about.stats.length === 0 && (
                    <p className={styles.empty}>No statistics added.</p>
                )}

                {about.stats.map((stat, index) => (
                    <div key={index} className={styles.itemCard}>
                        <input
                            type="text"
                            placeholder="Value (e.g. 50K+)"
                            value={stat.value}
                            onChange={(e) =>
                                updateStat(index, "value", e.target.value)
                            }
                        />

                        <input
                            type="text"
                            placeholder="Label (e.g. Happy Customers)"
                            value={stat.label}
                            onChange={(e) =>
                                updateStat(index, "label", e.target.value)
                            }
                        />

                        <button
                            type="button"
                            className={styles.deleteBtn}
                            onClick={() => deleteStat(index)}
                        >
                            Delete Statistic
                        </button>
                    </div>
                ))}
            </div>

            {/* ================= CTA ================= */}

            <div className={styles.card}>
                <h2>Call To Action</h2>

                <div className={styles.formGrid}>
                    <input
                        type="text"
                        name="ctaTitle"
                        placeholder="CTA Title"
                        value={about.ctaTitle}
                        onChange={handleChange}
                    />

                    <textarea
                        rows={4}
                        name="ctaDescription"
                        placeholder="CTA Description"
                        value={about.ctaDescription}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="ctaButtonText"
                        placeholder="Button Text"
                        value={about.ctaButtonText}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="ctaButtonLink"
                        placeholder="Button Link"
                        value={about.ctaButtonLink}
                        onChange={handleChange}
                    />
                </div>
            </div>

           

            {/* ================= TEAM ================= */}

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2>Team Members</h2>

                    <button
                        type="button"
                        className={styles.addBtn}
                        onClick={addTeamMember}
                    >
                        + Add Member
                    </button>
                </div>

                {about.team.length === 0 && (
                    <p className={styles.empty}>
                        No team members added.
                    </p>
                )}

                {about.team.map((member, index) => (
                    <div key={index} className={styles.teamCard}>
                        <label className={styles.fileLabel}>
                            Member Photo
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleTeamImageUpload(e, index)}
                            />
                        </label>

                        {uploading[`team-${index}`] && (
                            <p className={styles.uploadingText}>Uploading...</p>
                        )}

                        {member.image && (
                            <img
                                src={member.image}
                                alt={member.name}
                                className={styles.teamPreview}
                            />
                        )}

                        <input
                            type="text"
                            placeholder="Member Name"
                            value={member.name}
                            onChange={(e) =>
                                updateTeam(index, "name", e.target.value)
                            }
                        />

                        <input
                            type="text"
                            placeholder="Position"
                            value={member.position}
                            onChange={(e) =>
                                updateTeam(index, "position", e.target.value)
                            }
                        />

                        <textarea
                            rows={4}
                            placeholder="Description"
                            value={member.description}
                            onChange={(e) =>
                                updateTeam(index, "description", e.target.value)
                            }
                        />

                        <button
                            type="button"
                            className={styles.deleteBtn}
                            onClick={() => deleteTeam(index)}
                        >
                            Delete Member
                        </button>
                    </div>
                ))}
                 {/* ================= SAVE ================= */}

            <button
                className={styles.saveBtn}
                onClick={saveAbout}
                disabled={saving}
            >
                {saving ? "Saving..." : "Save About Page"}
            </button>
            </div>
        </section>
    );
}