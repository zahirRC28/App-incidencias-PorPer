import { Outlet } from "react-router-dom";
import "../styles/pages/tecnico.css";
import { Sidebar } from "../components/sidebar/Sidebar";


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
