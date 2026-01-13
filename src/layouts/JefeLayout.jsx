import { Outlet } from "react-router-dom";
import "../styles/pages/jefe.css";
import { Sidebar } from "../components/sidebar/Sidebar";

/**
 * Layout principal para la sección de Jefe.
 *
 * Incluye:
 * - Sidebar de navegación
 * - Contenedor principal (`<main>`) donde se renderizan las rutas hijas mediante `<Outlet />`.
 *
 * @component
 * @returns {JSX.Element} Layout de jefe
 */

export const JefeLayout = () => {
  return (
    <div className="jefe-layout">
      <Sidebar />
      <main className="jefe-content">
        <Outlet />
      </main>
    </div>
  )
}
