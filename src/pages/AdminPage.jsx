import { AdminLayout } from "../layouts/AdminLayout";
import { StatCard } from "../components/dashboard/StatCard";
import { UsersTable } from "../components/dashboard/UsersTable";

export const AdminPage = () => {

  const handleUserClick = (user) => {
    console.log("Usuario seleccionado:", user);
    // luego aquí navegas a /admin/usuarios/:id
  };

  return (
    <AdminLayout>
      <h1>Panel de Administración</h1>
      <p>Control total del sistema GMAO</p>

      <div className="stats-grid">
        <StatCard title="Usuarios" value="5" icon="👤" color="blue" />
        <StatCard title="Incidencias" value="5" icon="⚠️" color="orange" />
        <StatCard title="Máquinas" value="4" icon="⚙️" color="gray" />
        <StatCard title="Mantenimientos" value="3" icon="🛠️" color="green" />
      </div>

      <UsersTable onUserClick={handleUserClick} />
    </AdminLayout>
  );
};
