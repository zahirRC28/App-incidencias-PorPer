import { useState, useEffect } from "react";

import { StatCard } from "../components/dashboard/StatCard";
import { DataTable } from "../components/dashboard/DataTable";
import { Modal } from "../components/Modal";
import { incidencias } from "../hooks/incidencias";
import { maquinas } from "../hooks/maquinas";
import maquinasIcon from "../assets/dashboard/maquinasIcon.svg";
import incidenciasIcon from "../assets/dashboard/incidenciasIcon.svg";

export const TecnicoPage = () => {
  const { todasIncidencias } = incidencias();
  const { todasMaquinas } = maquinas();

  const [loading, setLoading] = useState(false);
  const [datosInci, setDatosInci] = useState([]);
  const [datosMaqui, setDatosMaqui] = useState([]);
  const [error, setError] = useState(null);
  const [openInci, setOpenInci] = useState(false);
  const [selectedInci, setSelectedInci] = useState(null);
  const [openMaqui, setOpenMaqui] = useState(false);
  const [selectedMaqui, setSelectedMaqui] = useState(null);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [incidenciasData, maquinasData] = await Promise.all([
        todasIncidencias(),
        todasMaquinas()
      ]);
      setDatosInci(incidenciasData || []);
      setDatosMaqui(maquinasData || []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar datos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { cargarDatos(); }, []);

  const incidenciasColumns = [
    { key: "titulo", label: "Título" },
    { key: "estado_nombre", label: "Estado" },
    { key: "fecha_creacion", label: "Fecha" },
    { key: "prioridad_nombre", label: "Prioridad" }
  ];

  const handleInciClick = (inci) => { setSelectedInci(inci); setOpenInci(true); }

  return (
    <>
      <h1>Panel Técnico</h1>
      <p>Herramientas y gestión para Técnicos</p>

      <div className="stats-grid">
        <StatCard title="Mis Incidencias" value={datosInci.length} icon={incidenciasIcon} color="green" />
        <StatCard title="Máquinas" value={datosMaqui.length} icon={maquinasIcon} color="gray" />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <DataTable
        title="Incidencias"
        columnas={incidenciasColumns}
        data={datosInci}
        onClickInfo={handleInciClick}
        todos={'/tecnico/incidencias'}
      />

      <DataTable
        title="Máquinas"
        columnas={[
          { key: 'nombre', label: 'Nombre' },
          { key: 'modelo', label: 'Modelo' },
          { key: 'estado_nombre', label: 'Estado' }
        ]}
        data={datosMaqui}
        onClickInfo={(m) => { setSelectedMaqui(m); setOpenMaqui(true); }}
        todos={'/tecnico/maquinas'}
      />

      {loading && <p>Cargando datos...</p>}

      <Modal open={openInci} onClose={() => setOpenInci(false)}>
        <h2>Detalle de la Incidencia</h2>
        {selectedInci ? (
          <div className="info">
            <p>Título: {selectedInci.titulo}</p>
            <p>Descripción: {selectedInci.descripcion}</p>
            <p>Estado: {selectedInci.estado_nombre}</p>
            <p>Prioridad: {selectedInci.prioridad_nombre}</p>
          </div>
        ) : <p>No hay incidencia seleccionada.</p>}
        <button onClick={() => setOpenInci(false)}>Cerrar</button>
      </Modal>

      <Modal open={openMaqui} onClose={() => setOpenMaqui(false)}>
        <h2>Detalle de la Máquina</h2>
        {selectedMaqui ? (
          <div className="info">
            <p>Nombre: {selectedMaqui.nombre}</p>
            <p>Modelo: {selectedMaqui.modelo}</p>
            <p>Estado: {selectedMaqui.estado_nombre}</p>
          </div>
        ) : <p>No hay máquina seleccionada.</p>}
        <button onClick={() => setOpenMaqui(false)}>Cerrar</button>
      </Modal>
    </>
  )
}

