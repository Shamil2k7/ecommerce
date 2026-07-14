
import StaffSidebar from "@/components/SaffSidebar/SaffSidebar";
import styles from "./StaffDashboard.module.css";

export default function StaffLayout({ children }) {
  return (
    <div className={styles.layout}>
      <StaffSidebar />

      <div className={styles.main}>
         

        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}