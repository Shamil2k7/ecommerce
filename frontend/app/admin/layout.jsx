import AdminShell from "@/components/AdminShell/AdminShell";

export const metadata = {
  title: "Admin Dashboard",
  description: "ShopAura Admin Panel",
};

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}