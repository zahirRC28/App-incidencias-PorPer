import { Outlet } from "react-router-dom";
import "../styles/pages/tecnico.css";
import { Sidebar } from "../components/sidebar/Sidebar";

/**
 * Layout principal para la sección de Técnico.
 *
 * Incluye:
 * - Sidebar de navegación
 * - Contenedor principal (`<main>`) donde se renderizan las rutas hijas mediante `<Outlet />`.
 *
 * @component
 * @returns {JSX.Element} Layout de técnico
 */

export const TecnicoLayout = () => {
  return (
    <div className="tecnico-layout">
      <Sidebar />
      <main className="tecnico-content">
        <Outlet/>
      </main>
    </div>
  )
}
