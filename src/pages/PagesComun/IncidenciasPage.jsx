import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { incidencias } from "../../hooks/incidencias";
import { DataTable } from "../../components/dashboard/DataTable";
import { userAuth } from "../../hooks/userAuth";
import { Modal } from "../../components/Modal";


export const IncidenciasPage = () => {
    const { todasIncidencias } = incidencias();
    const { getRole } = userAuth();
    const [loading, setLoading] = useState(false);
    const [datos, setDatos] = useState([]);
    const [selectInci, setSelectInci] = useState(null);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();
    const rol = getRole();
    let crear;
    let detalles;
    if (rol == "Administrador"){
        crear = `/admin/incidencia/crear`
        detalles =`/admin/incidencia/detalles`
    }else if(rol == "Jefe"){
        detalles =`/jefe/incidencia/detalles`
    }else if(rol == "Tecnico"){
        detalles =`/tecnico/incidencia/detalles`
    }else{
        crear = `/cliente/incidencia/crear`
        detalles =`/cliente/incidencia/detalles`
    }

    const cargarDatos = async () => {
        setLoading(true);
        try {
          const incidencias = await todasIncidencias();
          //console.log(incidencias);
          setDatos(incidencias);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
    };
    
    useEffect(() => {
        cargarDatos();
    }, []);
    
    const formatFecha = (fecha) =>
        new Date(fecha).toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    const handleIncidenClick = (dato) => {
        console.log("Incidencia seleccionada:", dato);
        setSelectInci(dato);
        setOpen(true);
    }
    const handleCerrar = ()=>{
        setOpen(false);
        setSelectInci(null);
    }
    
    const incidenciasColums = [
        { key: "titulo", label: "Título" },
        { key: "estado_nombre", label: "Estado" },
        { key: "fecha_creacion", label: "Fecha de Creación" },
        { key: "maquina_nombre", label: "Maquina"}
    ];


    return (
        <>
            {rol == "Administrador" &&
                <h2>Incidencias del Sistema</h2>
            }
            {rol == "Cliente" &&
                <h2>Incidencias del Cliente</h2>
            }
            {(rol == "Administrador" || rol == "Cliente") &&
                <button onClick={()=> navigate(crear)} >Crear Incidencia</button>
            }
            
            <DataTable
                title="Incidencias del Cliente"
                columnas={incidenciasColums}
                data={datos}
                onClickInfo={(incidencia) => handleIncidenClick(incidencia)}
                todos="/admin/users"
            />
            {loading && <p>Cargando datos...</p>}
            <Modal open={open} onClose={handleCerrar}>
                <h2 className="titulo-modal">Detalle de la Incidencia</h2>
                {selectInci ? (
                    <>
                        <div className="info">
                            <p>Titulo: {selectInci.titulo}</p>
                            <p>Descripcion: {selectInci.descripcion}</p>
                            <p>Fecha Incidencia: {formatFecha(selectInci.fecha_creacion)}</p>
                            <p>Estado: {selectInci.estado_nombre}</p>
                            <p>Maquina: {selectInci.maquina_nombre}</p>
                        </div>
                        <button onClick={()=> navigate(`${detalles}/${selectInci.id_incidencia}`)}>Detalles</button>
                    </>
                ): (
                    <p className="info">No hay información de la incidencia seleccionada.</p>
                )}
                <button onClick={handleCerrar}>Cerrar</button>
            </Modal>
        </>
    )
}
