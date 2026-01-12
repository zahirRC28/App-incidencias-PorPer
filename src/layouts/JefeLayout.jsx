import { Outlet } from "react-router-dom";
import "../styles/pages/jefe.css";
import { Sidebar } from "../components/sidebar/Sidebar";

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
