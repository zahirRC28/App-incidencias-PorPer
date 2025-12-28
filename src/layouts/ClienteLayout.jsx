import "../styles/pages/cliente.css";
import { Sidebar } from "../components/sidebar/Sidebar";

export const ClienteLayout = ({ children }) => {
  return (
    <div className="cliente-layout">
      <Sidebar />
      <main className="cliente-content">{children}</main>
    </div>
  )
}
