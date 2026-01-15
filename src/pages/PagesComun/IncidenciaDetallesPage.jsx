import { useParams } from "react-router-dom";
import { incidencias } from "../../hooks/incidencias";
import { useEffect, useState } from "react";
import "../../styles/pages/detallesIncidencia.css"
import { Modal } from "../../components/Modal";
import { userAuth } from "../../hooks/userAuth";
import { Button } from "../../components/ui/Button";
import { maquinas } from "../../hooks/maquinas";

/**
 * Página para ver los detalles completos de una incidencia.
 *
 * Permite:
 * - Visualizar datos de la incidencia (título, descripción, estado, prioridad, archivos, informes, etc.)
 * - Cambiar estado o prioridad de la incidencia
 * - Asignar técnico o jefe según rol
 * - Descargar PDF de la incidencia
 * - Crear informes
 * - Ampliar foto principal en un modal
 *
 * Roles permitidos: Administrador, Jefe, Técnico, Cliente (solo lectura para Cliente)
 *
 * @component
 * @returns {JSX.Element} Componente de detalle de incidencia
 */

export const IncidenciaDetallesPage = () => {
    const { getRole, userPoRole, user, token } = userAuth();
    const { id } = useParams();
    const { IncidenciaPorId, 
        obtenerInformesPorIncidencia, 
        todosEstadosInci, 
        todosPrioriInci, 
        error, 
        limpiarErrores, 
        cambiarEstadoInci, 
        cambiarPrioriInci, 
        asignarJefe, 
        asignarTecnico, 
        crearInforme, 
        descargarPdf,
        mensaje,
        limpiarMensaje 
    } = incidencias();
    const { cambiarEstadoMaquina } = maquinas();
    const [datos, setDatos] = useState(null);
    const [imagenAbierta, setImagenAbierta] = useState(false);

    const [estadosList, setEstadosList]= useState([]);
    const [prioriList, setPrioriList]= useState([]);
    const [userList, setUserList]= useState([]);
    const [informes, setInformes] = useState([]);

    const [activarTecnicos, setActivarTenicos] = useState(false)
    
    const rol = getRole();   
    /**
   * Carga los datos de la incidencia y listas auxiliares según el rol.
   */
    const cargarDatos = async () => {
        try {
            const incidencia = await IncidenciaPorId(id);
            setDatos(incidencia);

            if (rol === 'Administrador' || rol === 'Jefe') {
                const [
                    prioridades,
                    estados,
                    usuarios,
                    informes
                ] = await Promise.all([
                    todosPrioriInci(),
                    todosEstadosInci(),
                    userPoRole("Tecnico"),
                    obtenerInformesPorIncidencia(id)
                ]);

                setPrioriList(prioridades || []);
                setEstadosList(estados || []);
                setUserList(usuarios || []);
                setInformes(informes || []);
            }
            if (rol === 'Tecnico') {
                const estados = await todosEstadosInci();
                const informes = await obtenerInformesPorIncidencia(id);
                setEstadosList(estados || []);
                setInformes(informes || []);
            }
            limpiarMensaje();
        } catch (error) {
            console.error("Error cargando datos:", error);
        }
    };

    /**
   * Devuelve un valor o un texto por defecto si es null/undefined.
   * @param {any} valor - Valor a mostrar
   * @returns {string} Valor mostrado
   */
    //Para que se vea mejor cuando no tiene valor
    const mostrarDato = (valor) => valor ?? "No tiene";

    /**
   * Formatea una fecha a formato "dd/mm/yyyy hh:mm".
   * @param {string} fecha - Fecha en formato ISO
   * @returns {string} Fecha formateada
   */
    //console.log(rol);
    const formatFecha = (fecha) =>
        new Date(fecha).toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    // Carga inicial y recarga cuando cambian id, rol o usuario
    useEffect(() => {
        if (!rol || !user?.uid) return;
            cargarDatos();
    }, [id, rol, user]);

    /**
   * Cierra el modal de imagen.
   */
    const cerrarModal = ()=>{
        setImagenAbierta(false);
    }

    /**
   * Asigna el jefe actual a la incidencia y cambia su estado a "Asignada/Abierta".
   */
    const handleActualizarEstado = async()=>{
        const result = await asignarJefe(id, user.uid)
        if(result){
            const resultado = await cambiarEstadoInci("Asignada/Abierta",id);
            if(resultado){
                await cargarDatos();
            }
        }
    }

    /**
   * Cambia la prioridad de la incidencia y activa el selector de técnicos.
   * @param {Event} ev - Evento submit del formulario
   */
    const handleActualizarPrioridad = async(ev)=>{
        ev.preventDefault();
        const prioridad_nombre = ev.target.prioridad_nombre.value;
        //console.log(prioridad_nombre);
        const result = await cambiarPrioriInci(prioridad_nombre, id);
        if(result){
            setActivarTenicos(true);
        }
        console.log(result);
    }

    /**
   * Cambia el estado de la incidencia según el select.
   * @param {Event} ev - Evento submit del formulario
   */
    const handleCambiarEstadoSubmit = async (ev) => {
        ev.preventDefault();
        const estado_nombre = ev.target.estado_nombre.value;
        if (!estado_nombre) return;
        const result = await cambiarEstadoInci(estado_nombre, id);
        if (result) {
            await cargarDatos();
        }
    }

    /**
   * Crea un informe asociado a la incidencia.
   * Si es tipo "Resolución", también cambia estado de la incidencia y de la máquina.
   * @param {Event} ev - Evento submit del formulario
   */
    const handleCrearInforme = async (ev) => {
        ev.preventDefault();
        const texto = ev.target.texto.value;
        const tipo = ev.target.tipo.value;
        if (!texto || !tipo) return;
        const payload = {
            texto,
            tipo,
            id_incidencia: Number(id),
            id_tecnico: user?.uid ? Number(user.uid) : undefined
        }
        const info = await crearInforme(payload);
        if(tipo === 'Resolucion'){
            const result = await cambiarEstadoInci("Resuelta",id)
            const result2 = await cambiarEstadoMaquina(datos.id_maquina, "Funcionando") 
        }
        if (info?.ok) {
            await cargarDatos();
        }
    }

    /**
   * Asigna un técnico a la incidencia.
   * @param {Event} ev - Evento submit del formulario
   */
    const handleAsignar = async (ev) => {
        ev.preventDefault();
        const id_tecnico = ev.target.tecnico_id?.value;
        if (!id_tecnico) return;
        await asignarTecnico(id, id_tecnico);
        setActivarTenicos(false);
        await cargarDatos();
        limpiarErrores();
    }

    /**
   * Descarga un PDF de la incidencia.
   */
    const handleDownloadPdf = () => {
        descargarPdf(id)
    }

    // Renderizado
    if (!datos ) {
        return <p>Cargando incidencia...</p>;
    }

    return (
        <>
            <div className="incidencia-detalles">
                <div className="incidencia-header">
                    <h2>{datos.titulo}</h2>
                    <span className={`badge estado`}>
                    {mostrarDato(datos.estado_nombre)}
                    </span>
                    {(rol === 'Administrador' || rol === 'Jefe' || rol === 'Tecnico') && (datos.estado_nombre === 'Resuelta') && (
                        <button onClick={handleDownloadPdf}>Descargar PDF</button>
                    )}
                </div>
                {/* Imagen */}
            {datos.foto_url ? (
                <div className="imagen-incidencia">
                <img
                    src={`${datos.foto_url}`}
                    alt="Imagen de la incidencia"
                    onClick={() => setImagenAbierta(true)}
                />
                <span className="imagen-hint">Click para ampliar</span>
                </div>
            ): (
                <p>No tiene foto Principal</p>
            )}

                {/* Descripción */}
                <div className="infoDe">
                    <p className="infoDe-title">Descripción</p>
                    <p>{datos.descripcion}</p>
                </div>
                {/* Grid de datos */}
                <div className="infoDe-grid">
                    <div className="infoDe-item">
                        <p className="infoDe-label">Fecha</p>
                        <p className="infoDe-value">{datos.fecha_creacion ? formatFecha(datos.fecha_creacion) : mostrarDato(null)}</p>
                    </div>

                    <div className="infoDe-item">
                        <p className="infoDe-label">Máquina</p>
                        <p className="infoDe-value">{mostrarDato(datos.maquina_nombre)}</p>
                    </div>
                    {(rol === 'Administrador' || rol === 'Jefe' || rol === 'Tecnico') &&(
                        <>
                            <div className="infoDe-item">
                                <p className="infoDe-label">Prioridad</p>
                                <p className="infoDe-value">{mostrarDato(datos.prioridad_nombre)}</p>
                            </div>

                            <div className="infoDe-item">
                                <p className="infoDe-label">Creador</p>
                                <p className="infoDe-value">{mostrarDato(datos.creador_nombre)}</p>
                            </div>

                            <div className="infoDe-item">
                                <p className="infoDe-label">Técnico</p>
                                <p className="infoDe-value">{mostrarDato(datos.tecnico_nombre)}</p>
                            </div>

                            <div className="infoDe-item">
                                <p className="infoDe-label">Jefe</p>
                                <p className="infoDe-value">{mostrarDato(datos.jefe_nombre)}</p>
                            </div>  
                        </>
                    )}

                    {datos?.estado_nombre === 'Enviada' && (rol === 'Administrador' || rol === 'Jefe') && (
                        <>
                            <button onClick={handleActualizarEstado}>Empezar Asignacion</button>
                        </>
                    )}
                    { datos?.estado_nombre === 'Asignada/Abierta' && (rol === 'Administrador' || rol === 'Jefe') &&(
                        <>
                            <form onSubmit={handleActualizarPrioridad}>
                                <label>Prioridades</label>
                                <select name="prioridad_nombre">
                                    <option value="">Selecciona una Prioridad</option>
                                    {(prioriList ?? []).map((priori, index) => (
                                    <option key={index} id={priori.id_prioridad_incidencia} value={priori.nombre}>{priori.nombre}</option>
                                    ))}
                                </select>
                                {
                                    error?.prioridad_nombre && <p className="Error">{error.prioridad_nombre.msg}</p>
                                }
                                <Button text="Cambiar Prioridad" type="submit"/>
                            </form>
                        </>
                    )}
                    { activarTecnicos && (rol === 'Administrador' || rol === 'Jefe') && datos?.estado_nombre === 'Asignada/Abierta' &&(
                        <>
                            <form onSubmit={handleAsignar}>
                                <label>Técnicos</label>
                                    <select name="tecnico_id" defaultValue="">
                                        <option value="">Selecciona un Técnico</option>
                                        {(userList ?? []).map((tec, index) => (
                                            <option key={index} value={tec.id_usuario || tec.uid}>
                                                {tec.nombre_completo}
                                            </option>
                                        ))}
                                    </select>
                                { error?.id_tencino && <p className="Error">{error.id_tencino.msg || error.id_tencino}</p> }
                                <Button text="Asignar Técnico" type="submit"/>
                            </form>
                        </>
                    )}
            </div>
                {/* Archivos */}
            { datos.archivos?.length > 0 ? (
                <div className="infoDe">
                    <p className="infoDe-title">Archivos adjuntos</p>

                    <ul className="archivos-lista">
                    {(datos.archivos ?? []).map((archivo) => (
                        <li key={archivo.id_archivo}>
                        <a href={`${archivo.url}`} download>
                            📎 {archivo.nombre_original || 'Descargar archivo'}
                        </a>
                        </li>
                    ))}
                    </ul>
                </div>
            ):(
                <p>Esta incidencia no tiene archivos extra</p>
            )}
                {(rol === "Administrador" || rol === 'Jefe' || rol === 'Tecnico') && (informes ?? []).length > 0 ? (
                    <div className="infoDe">
                        <p className="infoDe-title">Informes</p>
                        <ul className="informes-lista">
                        {(informes ?? []).map((inf) => (
                            <li key={inf.id_informe || inf.id}>
                                <p>{inf.tipo} — {inf.tecnico_nombre || 'N/A'} — {inf.fecha ? formatFecha(inf.fecha) : ''}</p>
                                <p>{inf.texto}</p>
                            </li>
                        ))}
                        </ul>
                    </div>
                ) : (
                    (rol === "Administrador" || rol === "Jefe" || rol === "Tecnico") && (
                        <p>No hay informes para esta incidencia</p>
                    )
                )}
            </div>

            <Modal open={imagenAbierta} onClose={cerrarModal}>
                <img src={`${datos.foto_url}`} />
            </Modal>

            {/*Acciones para el tecnico*/}
            {((rol === 'Administrador' || rol === 'Tecnico') && (datos.estado_nombre !== 'Resuelta' ) && (datos.tecnico_nombre) && (datos.jefe_nombre) ) && (
                <div className="TecnicoOpciones">
                    <form onSubmit={handleCambiarEstadoSubmit}>
                        <label>Cambiar Estado</label>
                        <select name="estado_nombre" defaultValue="">
                            <option value="">Selecciona un Estado</option>
                            {estadosList.map((est, index) => (
                                <option key={index} value={est.nombre}>{est.nombre}</option>
                            ))}
                        </select>
                        { error?.estado_nombre && <p className="Error">{error.estado_nombre.msg}</p> }
                        <Button text="Cambiar Estado" type="submit"/>
                    </form>
                    {mensaje &&(
                        <p>{mensaje}</p>
                    )}

                {(rol === 'Administrador' || rol === 'Tecnico') && (datos.estado_nombre === 'En Pausa') && (
                    <form onSubmit={handleCrearInforme} className="informe-form">
                        <label>Crear Informe</label>
                        <textarea name="texto" placeholder="Escribe el informe..." />
                        <label>Tipo</label>
                        <select name="tipo" defaultValue="">
                            <option value="">Selecciona tipo</option>
                            <option value="Pausa">Pausa</option>
                            <option value="Resolucion">Resolución</option>
                        </select>
                        { error?.texto && <p className="Error">{error.texto.msg}</p> }
                        <Button text="Crear Informe" type="submit"/>
                    </form>
                )}
                {mensaje &&(
                    <p>{mensaje}</p>
                )}
                </div>
            )}
        </>
        
    )
}
