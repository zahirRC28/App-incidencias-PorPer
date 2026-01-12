import { Outlet } from "react-router-dom";
import "../styles/pages/cliente.css";
import { Sidebar } from "../components/sidebar/Sidebar";

export const ClienteLayout = () => {
  return (
    <div className="cliente-layout">
      <Sidebar />
      <main className="cliente-content">
        <Outlet />
      </main>
    </div>
  )
}
