"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  FacebookIcon,
  Instagram,
  TwitterIcon,
  LinkedinIcon,
} from "lucide-react";
import styles from "./Contact.module.css";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ContactPage() {
  const [contact, setContact] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getContact();
  }, []);

  const getContact = async () => {
    try {
      const { data } = await axios.get(`${API}/api/contact`);

      if (data.success) {
        setContact(data.contact);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${API}/api/contact/message`,
        form
      );

      alert(data.message);

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to send message"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!contact) {
    return (
      <section className={styles.loading}>
        Loading Contact...
      </section>
    );
  }

  return (
    <section className={styles.contact}>
      {/* Hero */}
      <div className={styles.hero}>
        <h1>Contact Us</h1>
        <p>
          We'd love to hear from you. Send us a message or
          visit our store.
        </p>
      </div>

      <div className={styles.container}>
        {/* Left Side */}
        <div className={styles.info}>
          <h2>Get in Touch</h2>

          <div className={styles.card}>
            <MapPin />
            <div>
              <h4>Address</h4>
              <p>{contact.address}</p>
            </div>
          </div>

          <div className={styles.card}>
            <Phone />
            <div>
              <h4>Phone</h4>
              <p>{contact.phone}</p>
            </div>
          </div>

          <div className={styles.card}>
            <Mail />
            <div>
              <h4>Email</h4>
              <p>{contact.email}</p>
            </div>
          </div>

          <div className={styles.card}>
            <Clock />
            <div>
              <h4>Working Hours</h4>
              <p>{contact.workingHours}</p>
            </div>
          </div>

          <div className={styles.socials}>
            {contact.facebook && (
              <a
                href={contact.facebook}
                target="_blank"
              >
                {/* <FacebookIcon /> */}
              </a>
            )}

            {contact.instagram && (
              <a
                href={contact.instagram}
                target="_blank"
              >
                {/* <Instagram /> */}
              </a>
            )}

            {contact.twitter && (
              <a
                href={contact.twitter}
                target="_blank"
              >
               {/* <TwitterIcon /> */}
              </a>
            )}

            {contact.linkedin && (
              <a
                href={contact.linkedin}
                target="_blank"
              >
             {/* <LinkedinIcon /> */}
              </a>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className={styles.formBox}>
          <h2>Send Message</h2>

          <form onSubmit={sendMessage}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              required
            />

            <textarea
              rows={6}
              name="message"
              placeholder="Write your message..."
              value={form.message}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={loading}
            >
              <Send size={18} />

              {loading
                ? "Sending..."
                : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      {/* Google Map */}
      {contact.map && (
        <div className={styles.map}>
          <iframe
            src={contact.map}
            loading="lazy"
            allowFullScreen
          />
        </div>
      )}
    </section>
  );
}