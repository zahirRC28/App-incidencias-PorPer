import { StatCard } from "../components/dashboard/StatCard";
import { DataTable } from "../components/dashboard/DataTable";
import { Modal } from "../components/Modal";
import { userAuth } from "../hooks/userAuth";
import { useState, useEffect } from "react";
import { incidencias } from "../hooks/incidencias";
import { maquinas } from "../hooks/maquinas";

export const AdminPage = () => {
  const { todosUser } = userAuth();
  const { todasIncidencias } = incidencias();
  const { todasMaquinas } = maquinas();
  const [loading, setLoading] = useState(false);
  const [datosUser, setDatosUser] = useState([]);
  const [datosInci, setDatosInci] = useState([]);
  const [datosMaqui, setDatosMaqui] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [openMaquinaInfo, setOpenMaquinaInfo] = useState(false);
  const [openInciInfo, setOpenInciInfo] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectMaquina, setSelectMaquina] = useState(null);
  const [selectInci, setSelectInci] = useState(null);
  
  const cargarDatos = async () => {
    setLoading(true);
    try {
      const usuarios = await todosUser();
      const incidencias = await todasIncidencias();
      const maquinas = await todasMaquinas();
      //console.log(usuarios);
      setDatosUser(usuarios);
      setDatosInci(incidencias);
      setDatosMaqui(maquinas);
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

  const incidenciasColums = [
    { key: "titulo", label: "Título" },
    { key: "estado_nombre", label: "Estado" },
    { key: "fecha_creacion", label: "Fecha de Creación" },
    { key: "maquina_nombre", label: "Maquina"}
  ];
  const maquinasColumns = [
    {key: "nombre", label: "Nombre Maquina" },
    {key: "modelo", label: "Modelo Maquina" },
    {key: "estado_nombre", label: "Estado Maquina" }
  ]

  const handleUserClick = (dato) => {
    //console.log("Usuario seleccionado:", dato);
    setSelectedUser(dato);
    setOpen(true)
  };
  const handleIncidenClick = (dato) => {
    //console.log("Incidencia seleccionada:", dato);
    setSelectInci(dato);
    setOpenInciInfo(true)
    
  }
  const handleMaquinaClick = (dato)=>{
    //console.log("Maquina seleccionada:", dato);
    setSelectMaquina(dato);
    setOpenMaquinaInfo(true);
  }
  const handleCerrar = ()=>{
    setOpenMaquinaInfo(false);
    setOpenInciInfo(false);
    setSelectInci(null);
    setSelectMaquina(null);
  }

  return (
    <>
      <h1>Panel de Administración</h1>
      <p>Control total del sistema GMAO</p>

      <div className="stats-grid">
        <StatCard title="Usuarios" value={datosUser.length} icon="👤" color="blue" />
        <StatCard title="Incidencias" value={datosInci.length} icon="⚠️" color="orange" />
        <StatCard title="Máquinas" value={datosMaqui.length} icon="⚙️" color="gray" />
        <StatCard title="Mantenimientos" value="3" icon="🛠️" color="green" />
      </div>
      
      {error && <p style={{ color: "red" }}>{error}</p>}
  
      <DataTable
        title="Usuarios del sistema"
        columnas={userColumns}
        data={datosUser}
        onClickInfo={(user) => handleUserClick(user)}
        todos="/admin/users"
        limit={3}
      />
      <DataTable
        title="Incidencias del Cliente"
        columnas={incidenciasColums}
        data={datosInci}
        onClickInfo={(incidencia) => handleIncidenClick(incidencia)}
        todos="/admin/incidencias"
        limit={3}
      />
      <DataTable
        title="Maquinas del Cliente"
        columnas={maquinasColumns}
        data={datosMaqui}
        onClickInfo={(maquina) => handleMaquinaClick(maquina)}
        todos="/admin/maquinas"
        limit={3}
      />
      {loading && <p>Cargando datos...</p>}
      <Modal open={open} onClose={() => setOpen(false)}>
        <h2 className="titulo-modal">Detalle del Usuario</h2>
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
      <Modal open={openMaquinaInfo} onClose={handleCerrar}>
          <h2 className="titulo-modal">Detalle de las maquina</h2>
          {selectMaquina ? (
            <>
              <div className="info">
                <p>Nombre: {selectMaquina.nombre}</p>
                <p>Modelo: {selectMaquina.modelo}</p>
                <p>Prioridad Sugerida: {selectMaquina.prioridad_cliente}</p>
                <p>Estado: {selectMaquina.estado_nombre}</p>
              </div>
            </>
          ): (
            <p className="info">No hay información de la máquina seleccionada.</p>
          )}
          <button onClick={handleCerrar}>Cerrar</button>
        </Modal>
        <Modal open={openInciInfo} onClose={handleCerrar}>
          <h2 className="titulo-modal">Detalle de la Incidencia</h2>
          {selectInci ? (
            <>
              <div className="info">
                <p>Titulo: {selectInci.titulo}</p>
                <p>Descripcion: {selectInci.descripcion}</p>
                <p>Fecha Incidencia: {selectInci.fecha_creacion}</p>
                <p>Estado: {selectInci.estado_nombre}</p>
                <p>Maquina: {selectInci.maquina_nombre}</p>
              </div>
            </>
          ):(
            <p className="info">No hay información de la incidencia seleccionada.</p>
          )}
          <button onClick={handleCerrar}>Cerrar</button>
        </Modal>
    </>
  );
};
