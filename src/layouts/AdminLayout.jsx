import { Outlet } from "react-router-dom";
import "../styles/pages/admin.css";
import { Sidebar } from "../components/sidebar/Sidebar";

export const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};