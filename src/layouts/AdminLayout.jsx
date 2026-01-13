import { Outlet } from "react-router-dom";
import "../styles/pages/admin.css";
import { Sidebar } from "../components/sidebar/Sidebar";

/**
 * Layout principal para la sección de Administrador.
 *
 * Incluye:
 * - Sidebar de navegación
 * - Contenedor principal (`<main>`) donde se renderizan las rutas hijas mediante `<Outlet />`.
 *
 * @component
 * @returns {JSX.Element} Layout de administrador
 */

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