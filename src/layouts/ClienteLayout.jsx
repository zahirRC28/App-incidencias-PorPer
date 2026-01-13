import { Outlet } from "react-router-dom";
import "../styles/pages/cliente.css";
import { Sidebar } from "../components/sidebar/Sidebar";

/**
 * Layout principal para la sección de Cliente.
 *
 * Incluye:
 * - Sidebar de navegación
 * - Contenedor principal (`<main>`) donde se renderizan las rutas hijas mediante `<Outlet />`.
 *
 * @component
 * @returns {JSX.Element} Layout de cliente
 */

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
