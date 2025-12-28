import "../styles/pages/jefe.css";
import { Sidebar } from "../components/sidebar/Sidebar";

export const JefeLayout = ({ children }) => {
  return (
    <div className="jefe-layout">
      <Sidebar />
      <main className="jefe-content">{children}</main>
    </div>
  )
}
