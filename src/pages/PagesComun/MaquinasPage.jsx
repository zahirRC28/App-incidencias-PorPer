import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DataTable } from "../../components/dashboard/DataTable";
import { userAuth } from "../../hooks/userAuth";
import { maquinas } from "../../hooks/maquinas";
import { Modal } from "../../components/Modal";

export const MaquinasPage = () => {
  const { todasMaquinas, eliminarMaquina, mensaje} = maquinas();
  const { getRole } = userAuth();
  const [loading, setLoading] = useState(false);
  const [datos, setDatos] = useState([]);
  const [open, setOpen] = useState(false)
  const [confirmacion, setConfirmacion] = useState(false);
  const [selectMaquina, setSelectMaquina] = useState(null);

  const navigate = useNavigate();
  const rol = getRole();
  let crear = '/admin/maquina/crear';

  const cargadorDatos = async()=>{
    setLoading(true);
    try {
      const maquinas = await todasMaquinas();
      setDatos(maquinas);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    cargadorDatos();
  }, []);

  const handleMaquiClick = (dato) => {
    console.log("Maquina seleccionada:", dato);
    setSelectMaquina(dato);
    setOpen(true)
  }
  const handleCerrar = ()=>{
    setOpen(false);
    setSelectMaquina(null);
  }

  const maquinasColumns = [
    {key: "nombre", label: "Nombre Maquina" },
    {key: "modelo", label: "Modelo Maquina" },
    {key: "estado_nombre", label: "Estado Maquina" }
  ]
  if(rol == "Administrador"){
    maquinasColumns.push({key: "usuario_nombre", label: "Usuario" },{key: "id_usuario", label: "ID Usuario" } )
  }

  const handleConfirmacion = ()=>{
    setConfirmacion(true);
  }
  const handleEliminarMaquina = async () => {
    if (!selectMaquina) return;

    try {
      await eliminarMaquina(selectMaquina.id_maquina);
      setConfirmacion(false);
      setOpen(false);
      setSelectMaquina(null);
      cargadorDatos(); // refresca la tabla
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {rol == "Administrador" &&
        <>
          <h2>Maquinas del Sistema</h2>
          <button onClick={()=> navigate(crear)} >Crear maquina</button>
        </>
      }
      {rol == "Cliente" &&
        <h2>Maquinas del Cliente</h2>
      }
      
      <DataTable
        title="Maquinas del Cliente"
        columnas={maquinasColumns}
        data={datos}
        onClickInfo={(maquina) => handleMaquiClick(maquina)}
      />
      {loading && <p>Cargando datos...</p>}
      <Modal open={open} onClose={handleCerrar}>
        <h2 className="titulo-modal">Detalle de Maquina</h2>
        { selectMaquina ?(
          <>
            <div className="info">
              <p>Nombre: {selectMaquina.nombre}</p>
              <p>Modelo: {selectMaquina.modelo}</p>
              <p>Prioridad Sugerida: {selectMaquina.prioridad_cliente}</p>
              <p>Estado: {selectMaquina.estado_nombre}</p>
              {
                selectMaquina.usuario_nombre && (
                  <>
                    <p>ID Usuario: {selectMaquina.id_usuario}</p>
                    <p>Propietario: {selectMaquina.usuario_nombre}</p>
                  </>
                )
              }
            </div>
          </>
        ):(
          <p className="info">No hay información de la máquina seleccionada.</p>
        )}
        { rol === 'Administrador' &&(
          <>
            <button onClick={()=> navigate(`/admin/maquina/actualizar/${selectMaquina.id_maquina}`)}>Editar</button>
            <button onClick={handleConfirmacion} >Eliminar</button>
          </>
        )}
        <button onClick={handleCerrar}>Cerrar</button>
      </Modal>
      <Modal open={confirmacion} onClose={() => setConfirmacion(false)}>
            <h2>Seguro que quieres eliminar la maquina?</h2>
            {
                mensaje && <p style={{ color: "green" }}>{mensaje}</p>
            }
            <button onClick={handleEliminarMaquina}>Eliminar</button>
            <button onClick={() => setConfirmacion(false)}>Cancelar</button>
      </Modal>
    </>
  )
}
