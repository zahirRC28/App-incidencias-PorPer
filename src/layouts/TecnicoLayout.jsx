import "../styles/pages/tecnico.css";
import { Sidebar } from "../components/sidebar/Sidebar";


export const TecnicoLayout = ({ children }) => {
  return (
    <div className="tecnico-layout">
      <Sidebar />
      <main className="tecnico-content">{children}</main>
    </div>
  )
}
