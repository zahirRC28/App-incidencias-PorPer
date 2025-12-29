import { useState, useEffect } from "react";
import { DataTable } from "../../components/dashboard/DataTable"
import { Modal } from "../../components/Modal"
import "../../styles/pages/user.css"
import { userAuth } from "../../hooks/userAuth";
import { useNavigate } from "react-router-dom";

// import { Button } from "../../components/ui/Button";


export const UsersPage = () => {
    const { todosUser, eliminarUser } = userAuth();
    const [loading, setLoading] = useState(false);
    const [datos, setDatos] = useState([]);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const navigate = useNavigate();
    const crear = '/admin/users/crear';
    const editar = '/admin/users/actualizar';
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
        { key: "correo", label: "Email" },
        { key: "fecha_ingreso", label: "fecha-ingreso" }
    ];

    const handleUserClick = (dato) => {
    //console.log("Usuario seleccionado:", dato);
    setSelectedUser(dato);
    setOpen(true)
    };
    const handleEliminarUser =() =>{
        eliminarUser(selectedUser.id_usuario, selectedUser.correo);
        setOpen(false);
    }
  return (
    <>
        <h2>Usuarios del sistema</h2>
        <p>Gestión de usuarios registrados en el sistema</p>
        <button onClick={() => navigate(crear)}>Crear Usuario</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <DataTable
            title="Usuarios del sistema"
            columnas={userColumns}
            data={datos}
            onClickInfo={(user) => handleUserClick(user)}
        />
        {loading && <p>Cargando datos...</p>}
        <Modal open={open} onClose={() => setOpen(false)}>
            <h2>Detalle del Usuario</h2>
            {selectedUser && (
                <>
                    <div className="info">
                        <p>ID:{selectedUser.id_usuario}</p>
                        <p>Nombre:{selectedUser.nombre_completo}</p>
                        <p>Rol: {selectedUser.rol_nombre}</p>
                        <p>Email: {selectedUser.correo}</p>
                        <p>fecha-ingreso: {selectedUser.correo}</p>
                    </div>
                    <button onClick={() => navigate(`/admin/users/actualizar/${selectedUser.id_usuario}`)}>Editar</button>
                    <button onClick={handleEliminarUser}>Eliminar</button>
                    <button onClick={() => setOpen(false)}>Cancelar</button>
                </>
            )}
        </Modal>
    </>
  )
}
