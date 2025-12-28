import "../styles/pages/admin.css";
import { Sidebar } from "../components/sidebar/Sidebar";

export const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-content">{children}</main>
    </div>
  );
};