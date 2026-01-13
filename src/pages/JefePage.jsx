import { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

import { StatCard } from "../components/dashboard/StatCard";
import { DataTable } from "../components/dashboard/DataTable";
import { Modal } from "../components/Modal";
import { incidencias } from "../hooks/incidencias";
import { maquinas } from "../hooks/maquinas";
import maquinasIcon from "../assets/dashboard/maquinasIcon.svg";
import incidenciasIcon from "../assets/dashboard/incidenciasIcon.svg";
import mantenimientosIcon from "../assets/dashboard/mantenimientoIcon.svg";

export const JefePage = () => {
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
    { key: "maquina_nombre", label: "Máquina" }
  ];

  const maquinasColumns = [
    { key: "nombre", label: "Nombre" },
    { key: "modelo", label: "Modelo" },
    { key: "estado_nombre", label: "Estado" }
  ];

  const handleInciClick = (inci) => { setSelectedInci(inci); setOpenInci(true); }
  const handleMaquinaClick = (maqui) => { setSelectedMaqui(maqui); setOpenMaqui(true); }
  
  const estados = ["Enviada", "Asignada/Abierta", "En Proceso", "En Pausa", "Resuelta"];
  const incidenciasPorEstado = estados.map(estado =>
    datosInci.filter(i => i.estado_nombre === estado).length
  );
  const pieData = {
    labels: estados,
    datasets: [
      {
        label: "Incidencias",
        data: incidenciasPorEstado,
        backgroundColor: ["#f59e0b", "#2563eb", "#13b6f7", "#e1d332", "#16a34a"]
      }
    ]
  };
  const nombresMaquinas = datosMaqui.map(m => m.nombre);
  const incidenciasPorMaquina = datosMaqui.map(maquina =>
    datosInci.filter(i => i.maquina_nombre === maquina.nombre).length
  );
  const barData = {
    labels: nombresMaquinas,
    datasets: [
      {
        label: "Incidencias por máquina",
        data: incidenciasPorMaquina,
        backgroundColor: "#2563eb"
      }
    ]
  };
  return (
    <>
      <h1>Panel de Jefe</h1>
      <p>Resumen y gestión para Jefes</p>

      <div className="stats-grid">
        <StatCard title="Incidencias" value={datosInci.length} icon={incidenciasIcon} color="orange" />
        <StatCard title="Máquinas" value={datosMaqui.length} icon={maquinasIcon} color="gray" />
        <StatCard title="Mantenimientos" value="3" icon={mantenimientosIcon} color="green" />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Incidencias por Estado</h3>
          <Pie data={pieData} />
        </div>
        <div className="chart-card">
          <h3>Incidencias por Máquina</h3>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
        </div>
      </div>

      <DataTable
        title="Incidencias"
        columnas={incidenciasColumns}
        data={datosInci}
        onClickInfo={handleInciClick}
        todos={'/jefe/incidencias'}
      />

      <DataTable
        title="Máquinas"
        columnas={maquinasColumns}
        data={datosMaqui}
        onClickInfo={handleMaquinaClick}
        todos={'/jefe/maquinas'}
      />

      {loading && <p>Cargando datos...</p>}

      <Modal open={openInci} onClose={() => setOpenInci(false)}>
        <h2>Detalle de la Incidencia</h2>
        {selectedInci ? (
          <div className="info">
            <p>Título: {selectedInci.titulo}</p>
            <p>Descripción: {selectedInci.descripcion}</p>
            <p>Estado: {selectedInci.estado_nombre}</p>
            <p>Máquina: {selectedInci.maquina_nombre}</p>
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
