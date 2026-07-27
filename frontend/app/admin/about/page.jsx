"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./About.module.css";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AdminAboutPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [about, setAbout] = useState({
        title: "",
        subtitle: "",
        description: "",

        storyTitle: "",
        storyDescription: "",
        storyImage: "",

        mission: "",
        vision: "",

        heroImage: "",

        stats: [],
        features: [],
        team: [],
    });

    useEffect(() => {
        fetchAbout();
    }, []);

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
                    number: "",
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
                setAbout(data.about);
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

                    <input
                        type="text"
                        name="heroImage"
                        placeholder="Hero Image URL"
                        value={about.heroImage}
                        onChange={handleChange}
                    />
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

                    <input
                        type="text"
                        name="storyImage"
                        placeholder="Story Image URL"
                        value={about.storyImage || ""}
                        onChange={handleChange}
                    />

                    <textarea
                        rows={8}
                        name="storyDescription"
                        placeholder="Story Description"
                        value={about.storyDescription}
                        onChange={handleChange}
                    />
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

            {/* ================= SAVE ================= */}

            <button
                className={styles.saveBtn}
                onClick={saveAbout}
                disabled={saving}
            >
                {saving ? "Saving..." : "Save About Page"}
            </button>
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

                    <div
                        key={index}
                        className={styles.teamCard}
                    >

                        <input
                            type="text"
                            placeholder="Image URL"
                            value={member.image}
                            onChange={(e) =>
                                updateTeam(
                                    index,
                                    "image",
                                    e.target.value
                                )
                            }
                        />

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
                                updateTeam(
                                    index,
                                    "name",
                                    e.target.value
                                )
                            }
                        />

                        <input
                            type="text"
                            placeholder="Position"
                            value={member.position}
                            onChange={(e) =>
                                updateTeam(
                                    index,
                                    "position",
                                    e.target.value
                                )
                            }
                        />

                        <textarea
                            rows={4}
                            placeholder="Description"
                            value={member.description}
                            onChange={(e) =>
                                updateTeam(
                                    index,
                                    "description",
                                    e.target.value
                                )
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

            </div>
        </section>
    );
}
// ================= FEATURES =================

