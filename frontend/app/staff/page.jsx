    "use client";

    import Link from "next/link";
    import {
    ShoppingBag,
    Package,
    TicketPercent,
    Percent,
    Image,
    Star,
    TrendingUp,
    Clock,
    } from "lucide-react";

    import styles from "./StaffDashboard.module.css";

    const cards = [
    {
        title: "Products",
        value: "245",
        icon: <ShoppingBag size={28} />,
        color: styles.blue,
        link: "/staff/products",
    },
    {
        title: "Orders",
        value: "84",
        icon: <Package size={28} />,
        color: styles.green,
        link: "/staff/orders",
    },
    {
        title: "Coupons",
        value: "18",
        icon: <TicketPercent size={28} />,
        color: styles.orange,
        link: "/staff/coupons",
    },
    {
        title: "Offers",
        value: "12",
        icon: <Percent size={28} />,
        color: styles.purple,
        link: "/staff/offers",
    },
    {
        title: "Banners",
        value: "6",
        icon: <Image size={28} />,
        color: styles.red,
        link: "/staff/banners",
    },
    {
        title: "Reviews",
        value: "354",
        icon: <Star size={28} />,
        color: styles.yellow,
        link: "/staff/reviews",
    },
    ];

    export default function StaffDashboard() {
    return (
        <section className={styles.container}>
        <div className={styles.header}>
            <h1>Staff Dashboard</h1>
            <p>Manage products, orders, offers and store content.</p>
        </div>

        <div className={styles.grid}>
            {cards.map((card, index) => (
            <Link
                href={card.link}
                key={index}
                className={styles.card}
            >
                <div className={`${styles.icon} ${card.color}`}>
                {card.icon}
                </div>

                <div>
                <h2>{card.value}</h2>
                <p>{card.title}</p>
                </div>
            </Link>
            ))}
        </div>

        <div className={styles.bottom}>
            <div className={styles.box}>
            <h3>
                <TrendingUp size={20} />
                Today's Activity
            </h3>

            <ul>
                <li>✔ 15 Products Updated</li>
                <li>✔ 8 Orders Processed</li>
                <li>✔ 3 Coupons Created</li>
                <li>✔ 2 Banners Updated</li>
            </ul>
            </div>

            <div className={styles.box}>
            <h3>
                <Clock size={20} />
                Pending Tasks
            </h3>

            <ul>
                <li>• Review 12 Pending Orders</li>
                <li>• Add New Summer Offer</li>
                <li>• Upload Homepage Banner</li>
                <li>• Moderate Customer Reviews</li>
            </ul>
            </div>
        </div>
        </section>
    );
    }