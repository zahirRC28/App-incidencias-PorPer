import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { incidencias } from "../hooks/incidencias";
import { DataTable } from "../components/dashboard/DataTable";
import { StatCard } from "../components/dashboard/StatCard";
import { maquinas } from "../hooks/maquinas";
import { Modal } from "../components/Modal";
import maquinasIcon from "../assets/dashboard/maquinasIcon.svg";
import incidenciasIcon from "../assets/dashboard/incidenciasIcon.svg";

/**
 * Panel principal del cliente
 * @component
 * @returns {JSX.Element} Renderiza el dashboard del cliente con estadísticas, tablas y modales de detalle.
 */

export const ClientPage = () => {
  const { todasIncidencias } = incidencias();
  const { todasMaquinas } = maquinas();
  const [loading, setLoading] = useState(false);
  const [datosInci, setDatosInci] = useState([]);
  const [datosMaqui, setDatosMaqui] = useState([]);
  const [error, setError] = useState(null);
  const [openMaquinaInfo, setOpenMaquinaInfo] = useState(false);
  const [openInciInfo, setOpenInciInfo] = useState(false);
  const [selectMaquina, setSelectMaquina] = useState(null);
  const [selectInci, setSelectInci] = useState(null);

  const navigate = useNavigate();
  const crear = '/cliente/incidencia/crear'

  /**
   * Carga las incidencias y máquinas del cliente desde el backend
   * Maneja estados de carga y errores.
   */
  const cargarDatos = async () => {
    setLoading(true);
    try {
      const incidencias = await todasIncidencias();
      const maquinas = await todasMaquinas();
      //console.log(incidencias);
      setDatosInci(incidencias);
      setDatosMaqui(maquinas)
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

  /**
   * Abre modal de detalle de incidencia
   * @param {Object} dato Incidencia seleccionada
   */
  const handleIncidenClick = (dato) => {
    //console.log("Incidencia seleccionada:", dato);
    setSelectInci(dato);
    setOpenInciInfo(true)
    
  }

  /**
   * Abre modal de detalle de máquina
   * @param {Object} dato Máquina seleccionada
   */
  const handleMaquinaClick = (dato)=>{
    //console.log("Maquina seleccionada:", dato);
    setSelectMaquina(dato);
    setOpenMaquinaInfo(true);
  }

  /** Cierra los modales y limpia la selección */
  const handleCerrar = ()=>{
    setOpenMaquinaInfo(false);
    setOpenInciInfo(false);
    setSelectInci(null);
    setSelectMaquina(null);
  }

  /** Columnas para la tabla de incidencias */
  const incidenciasColums = [
    { key: "titulo", label: "Título" },
    { key: "estado_nombre", label: "Estado" },
    { key: "fecha_creacion", label: "Fecha de Creación" },
    { key: "maquina_nombre", label: "Maquina"}
  ];
  
  /** Columnas para la tabla de máquinas */
  const maquinasColumns = [
    {key: "nombre", label: "Nombre Maquina" },
    {key: "modelo", label: "Modelo Maquina" },
    {key: "estado_nombre", label: "Estado Maquina" }
  ]
  return (
    <>
        <h1>Panel de Cliente</h1>
        <p>Bienvenido al panel de cliente de GMAO</p>
        <div className="stats-grid">
          <StatCard title="Incidencias" value={datosInci.length} icon={incidenciasIcon} color="orange" />
          <StatCard title="Máquinas" value={datosMaqui.length} icon={maquinasIcon} color="gray" />
        </div>
        <button onClick={()=> navigate(crear)} >Aqui puedes crear tu Incidencia</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <DataTable
          title="Incidencias del Cliente"
          columnas={incidenciasColums}
          data={datosInci}
          onClickInfo={(incidencia) => handleIncidenClick(incidencia)}
          todos="/cliente/incidencias"
          limit={3}
        />
        <DataTable
          title="Maquinas del Cliente"
          columnas={maquinasColumns}
          data={datosMaqui}
          onClickInfo={(maquina) => handleMaquinaClick(maquina)}
          todos="/cliente/maquinas"
          limit={3}
        />
        {loading && <p>Cargando datos...</p>}
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
}


