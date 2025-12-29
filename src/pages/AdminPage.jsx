import { StatCard } from "../components/dashboard/StatCard";
import { DataTable } from "../components/dashboard/DataTable";
import { Modal } from "../components/Modal";
import { userAuth } from "../hooks/userAuth";
import { useState, useEffect } from "react";

export const AdminPage = () => {
  const { todosUser } = userAuth();
  const [loading, setLoading] = useState(false);
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const cargarDatos = async () => {
    setLoading(true);
    try {
      const usuarios = await todosUser();
      //console.log(usuarios);
      setDatos(usuarios);
    } catch (error) {
      console.log(error);
      setError("Error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const userColumns = [
    { key: "nombre_completo", label: "Nombre" },
    {
      key: "rol_nombre", label: "Rol",
      //uso el render para personalizar el contenido de la celda
      //y darle estilos segun el rol
      render: (user) => (
        <span className={`rol ${user.rol_nombre.toLowerCase()}`}>
          {user.rol_nombre}
        </span>
      )
    },
    { key: "correo", label: "Email" }
  ];

  const handleUserClick = (dato) => {
    //console.log("Usuario seleccionado:", dato);
    setSelectedUser(dato);
    setOpen(true)
  };

  return (
    <>
      <h1>Panel de Administración</h1>
      <p>Control total del sistema GMAO</p>

      <div className="stats-grid">
        <StatCard title="Usuarios" value={datos.length} icon="👤" color="blue" />
        <StatCard title="Incidencias" value="5" icon="⚠️" color="orange" />
        <StatCard title="Máquinas" value="4" icon="⚙️" color="gray" />
        <StatCard title="Mantenimientos" value="3" icon="🛠️" color="green" />
      </div>
      
      {error && <p style={{ color: "red" }}>{error}</p>}
  
      <DataTable
        title="Usuarios del sistema"
        columnas={userColumns}
        data={datos}
        onClickInfo={(user) => handleUserClick(user)}
        todos="/admin/users"
        limit={3}
      />
      <DataTable
        title="Usuarios del sistema"
        columnas={userColumns}
        data={datos}
        onClickInfo={(user) => handleUserClick(user)}
        todos="/admin/users"
        limit={3}
      />
      <DataTable
        title="Usuarios del sistema"
        columnas={userColumns}
        data={datos}
        onClickInfo={(user) => handleUserClick(user)}
        todos="/admin/users"
        limit={3}
      />
      <DataTable
        title="Usuarios del sistema"
        columnas={userColumns}
        data={datos}
        onClickInfo={(user) => handleUserClick(user)}
        todos="/admin/users"
        limit={3}
      />

      {loading && <p>Cargando datos...</p>}
      <Modal open={open} onClose={() => setOpen(false)}>
        <h2>Detalle del Usuario</h2>
          {selectedUser && (
            <>
              <div className="info">
                <p>Nombre:{selectedUser.nombre_completo}</p>
                <p>Rol: {selectedUser.rol_nombre}</p>
                <p>Email: {selectedUser.correo}</p>
              </div>
              <button onClick={() => setOpen(false)}>Cancelar</button>
            </>
          )}
      </Modal>
    </>
  );
};
