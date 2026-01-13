import { useState, useEffect } from "react";
import { DataTable } from "../../components/dashboard/DataTable"
import { Modal } from "../../components/Modal"
import "../../styles/pages/user.css"
import { userAuth } from "../../hooks/userAuth";
import { useNavigate } from "react-router-dom";

/**
 * Página de gestión de usuarios.
 *
 * Funcionalidades:
 * - Muestra todos los usuarios del sistema en una tabla.
 * - Permite ver detalles de un usuario en un modal.
 * - Permite crear, editar, cambiar estado o eliminar usuarios (solo Admin).
 *
 * @component
 * @returns {JSX.Element} Componente de la página de usuarios
 */
export const UsersPage = () => {
    const { todosUser, eliminarUser, estadoUser, mensaje, limpiarMensaje } = userAuth();
    const [loading, setLoading] = useState(false);
    const [datos, setDatos] = useState([]);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmacion, setConfirmacion] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const navigate = useNavigate();
    const crear = '/admin/users/crear';

    /**
   * Carga todos los usuarios y actualiza el estado `datos`.
   */
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
    
    useEffect(() => {
        if (mensaje) {
        // Recargar los datos después de una acción exitosa
        cargarDatos();
        }
    }, [mensaje]);

    /**
   * Columnas de la tabla de usuarios.
   * Incluye render personalizado para estado y rol con estilos.
   */
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
        { key: "fecha_ingreso", label: "fecha-ingreso" },
        { key: "activo", label: "Estado" ,
            render: (user) => user.activo ? "Activo" : "Inactivo"
        },
        { key: "fecha_baja", label: "fecha-baja" }
    ];

    /**
   * Maneja el clic sobre un usuario.
   * Abre el modal de detalles.
   * @param {Object} dato Usuario seleccionado
   */
    const handleUserClick = (dato) => {
    //console.log("Usuario seleccionado:", dato);
    setSelectedUser(dato);
    setOpen(true)
    };

    /**
   * Elimina el usuario seleccionado.
   * Cierra modales y limpia la selección después de 1.5s.
   */
    const handleEliminarUser =() =>{
        eliminarUser(selectedUser.id_usuario, selectedUser.correo);
        //poner un temporizador para cerrar el modal despues de eliminar y mostrar el mensaje
        setTimeout(()=>{
            limpiarMensaje();
            setOpen(false);
            setConfirmacion(false);
            setSelectedUser(null);
        },1500);
    }

    /**
   * Cambia el estado (activo/inactivo) del usuario seleccionado.
   * Cierra modal automáticamente después de 1.5s.
   */
    const handleEstadoUser =() =>{
        estadoUser(selectedUser.id_usuario);
        //poner un temporizador para cerrar el modal despues de eliminar y mostrar el mensaje
        setTimeout(()=>{
            limpiarMensaje();
            setOpen(false);
        },1500);
    }

    /**
   * Cierra el modal de detalle del usuario.
   */
    const handleCerrarModal = () =>{
        setOpen(false);
        setSelectedUser(null);
    }

    /**
   * Abre modal de confirmación para eliminar usuario.
   */
    const handleConfirmacion = () =>{
        setConfirmacion(true);
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
        <Modal open={open} onClose={handleCerrarModal}>
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
                    {
                        mensaje && <p style={{ color: "green" }}>{mensaje}</p>
                    }
                    <button onClick={() => navigate(`/admin/users/actualizar/${selectedUser.id_usuario}`)}>Editar</button>
                    <button onClick={handleEstadoUser}>Cambiar Estado</button>
                    <button onClick={handleConfirmacion}>Eliminar</button>
                    <button onClick={handleCerrarModal}>Cancelar</button>
                </>
            )}
        </Modal>
        <Modal open={confirmacion} onClose={() => setConfirmacion(false)}>
            <h2>Seguro que quieres eliminar el usuario?</h2>
            {
                mensaje && <p style={{ color: "green" }}>{mensaje}</p>
            }
            <button onClick={handleEliminarUser}>Eliminar</button>
            <button onClick={() => setConfirmacion(false)}>Cancelar</button>
        </Modal>
    </>
  )
}
