import "./admin.css";

export const metadata = {
  title: "Admin Portal | Sharma Real Estates",
  description: "Admin controls for listings, inquiries, content, and operations.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }) {
  return <div className="admin-portal">{children}</div>;
}
