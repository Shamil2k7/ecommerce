"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import styles from "./About.module.css";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AboutPage() {
    const [about, setAbout] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAbout();
    }, []);

    const fetchAbout = async () => {
        try {
            const { data } = await axios.get(`${API}/api/about`);

            if (data.success) {
                setAbout(data.about);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className={styles.loading}>
                <h2>Loading...</h2>
            </section>
        );
    }

    if (!about) {
        return (
            <section className={styles.loading}>
                <h2>About information not found.</h2>
            </section>
        );
    }

    return (
        <main className={styles.about}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <span className={styles.badge}>About Us</span>

                    <h1>{about.title}</h1>

                    <p>{about.subtitle}</p>
                </div>
            </section>

            {/* Story */}
            <section className={styles.container}>
                <div className={styles.story}>
                    <div className={styles.storyImage}>
                        <Image
                            src={about.image || "/about.jpg"}
                            alt={about.title ?? "About Us"}
                            width={700}
                            height={500}
                        />
                    </div>

                    <div className={styles.storyContent}>
                        <h2>Our Story</h2>

                        <p>{about.description}</p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className={styles.missionSection}>
                <div className={styles.container}>
                    <div className={styles.cards}>
                        <div className={styles.card}>
                            <h3>Our Mission</h3>

                            <p>{about.mission}</p>
                        </div>

                        <div className={styles.card}>
                            <h3>Our Vision</h3>

                            <p>{about.vision}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            {about.features?.length > 0 && (
                <section className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2>Why Choose Us</h2>

                        <p>We provide the best shopping experience.</p>
                    </div>

                    <div className={styles.features}>
                        {about.features.map((feature, index) => (
                            <div
                                key={index}
                                className={styles.featureCard}
                            >
                                <div className={styles.featureIcon}>
                                    ⭐
                                </div>

                                <h3>{feature.title}</h3>

                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Statistics */}
            {about.stats?.length > 0 && (
                <section className={styles.statsSection}>
                    <div className={styles.container}>
                        <div className={styles.stats}>
                            {about.stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className={styles.statCard}
                                >
                                    <h2>{stat.value}</h2>

                                    <p>{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Team */}
            {about.team?.length > 0 && (
                <section className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2>Meet Our Team</h2>

                        <p>
                            Dedicated professionals behind our
                            success.
                        </p>
                    </div>

                    <div className={styles.teamGrid}>
                        {about.team.map((member, index) => (
                            <div
                                key={index}
                                className={styles.teamCard}
                            >
                                <Image
                                    src={
                                        member.image || "/user-avatar.png"
                                    }
                                    alt={member.name}
                                    width={250}
                                    height={250}
                                />

                                <h3>{member.name}</h3>

                                <span>{member.position}</span>

                                <p>{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className={styles.cta}>
                <div className={styles.container}>
                    <h2>
                        Thank you for choosing{" "}
                        {about.storeName || "Our Store"}
                    </h2>

                    <p>
                        We are committed to providing quality
                        products and exceptional customer service.
                    </p>

                    <a
                        href="/products"
                        className={styles.shopBtn}
                    >
                        Shop Now
                    </a>
                </div>
            </section>
        </main>
    );
}