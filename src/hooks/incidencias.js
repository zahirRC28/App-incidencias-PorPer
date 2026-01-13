import conectar from "../helpers/fetch";
import { useState } from "react";
import { jwtDecode } from "jwt-decode"
import { userAuth } from "./userAuth";
import { maquinas } from "./maquinas";
const urlBase = import.meta.env.VITE_BACKEND_URL;

/**
 * Hook para manejar todas las operaciones relacionadas con incidencias.
 *
 * Este hook expone funciones para:
 * - Listar incidencias según rol del usuario
 * - Obtener una incidencia por ID
 * - Crear incidencias y subir archivos
 * - Cambiar estado o prioridad de una incidencia
 * - Asignar jefe o técnico
 * - Crear informes y descargar PDF de la incidencia
 *
 * @returns {Object} Objeto con funciones y estados del hook:
 * @returns {Function} todasIncidencias - Retorna todas las incidencias según el rol del usuario
 * @returns {Function} crearIncidencia - Crea una incidencia
 * @returns {Function} subirArchivo - Sube un archivo adjunto a una incidencia
 * @returns {Function} subirFotoPrincipal - Sube la foto principal de una incidencia
 * @returns {Function} crearIncidenciaConArchivos - Crea incidencia y sube archivos opcionales
 * @returns {Function} todosEstadosInci - Retorna todos los estados posibles de incidencias
 * @returns {Function} todosPrioriInci - Retorna todas las prioridades posibles
 * @returns {string|null} mensaje - Mensaje de éxito de la última operación
 * @returns {any|null} error - Errores de la última operación
 * @returns {Function} limpiarErrores - Limpia los errores
 * @returns {Function} limpiarMensaje - Limpia el mensaje
 * @returns {Function} IncidenciaPorId - Obtiene una incidencia por ID
 * @returns {Function} obtenerInformesPorIncidencia - Obtiene informes de una incidencia
 * @returns {Function} cambiarEstadoInci - Cambia el estado de una incidencia
 * @returns {Function} cambiarPrioriInci - Cambia la prioridad de una incidencia
 * @returns {Function} asignarJefe - Asigna un jefe a una incidencia
 * @returns {Function} asignarTecnico - Asigna un técnico a una incidencia
 * @returns {Function} crearInforme - Crea un informe para una incidencia
 * @returns {Function} descargarPdf - Descarga un PDF con la incidencia e informes
 */

export const incidencias = () => {
    const { getRole, token } = userAuth();
    const { cambiarEstadoMaquina } = maquinas();
    //console.log(token);
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);
    const [errorSolo, setErrorSolo] = useState(null)
    const { uid } = jwtDecode(token);
    //console.log(uid);
    const userRol = getRole();
    //console.log(uid);

    /**
     * Obtiene todas las incidencias según el rol del usuario autenticado.
     *
     * - Administrador/Jefe → todas las incidencias
     * - Técnico → incidencias asignadas al técnico
     * - Cliente → incidencias creadas por el cliente
     *
     * @returns {Promise<Array>} Lista de incidencias
     */

    const todasIncidencias = async()=>{
        let info;
        if(userRol == 'Administrador' || userRol == 'Jefe'){
            info = await conectar(`${urlBase}incidencia/todas`,'GET',{},token);
        }else if(userRol == 'Tecnico'){
            info = await conectar(`${urlBase}incidencia/porTecnico/${uid}`,'GET',{},token)
        }else if(userRol == 'Cliente'){
            info = await conectar(`${urlBase}incidencia/mias`,'GET',{},token);
        }
        const { incidencias }= info
        //console.log(incidencias);
        return incidencias        
    }

    /**
     * Obtiene una incidencia específica por su ID.
     *
     * @param {number|string} id - ID de la incidencia
     * @returns {Promise<Object>} Objeto con los datos de la incidencia
     */

    const IncidenciaPorId = async(id)=>{
        const info = await conectar(`${urlBase}incidencia/${id}`,'GET',{},token);
        //console.log(info);
        const { incidencia } = info;
        return incidencia;
    }

    /**
     * Obtiene todos los informes asociados a una incidencia.
     *
     * @param {number|string} id - ID de la incidencia
     * @returns {Promise<Array|undefined>} Lista de informes o undefined si no existen
     */


    const obtenerInformesPorIncidencia = async(id)=>{
        const info = await conectar(`${urlBase}informe/por-incidencia/${id}`,'GET',{},token);
        const { ok, informes } = info
        if (ok !== false){
            return informes;
        }
    }

    /**
     * Obtiene todos los estados posibles de una incidencia,
     * excluyendo algunos estados no permitidos para cambios manuales.
     *
     * @returns {Promise<Array>} Lista filtrada de estados
     */

    const todosEstadosInci = async()=>{
        const info = await conectar(`${urlBase}incidencia/todas/estados`,'GET',{},token)
        //console.log(info)
        const { estados } = info
        //console.log(estados);
        const NuevosEstados = estados.filter((estado)=>{
            return estado.nombre !== "Enviada" && estado.nombre !== "Asignada/Abierta" && estado.nombre !== "Resuelta"
        })
        //console.log(NuevosEstados);
        return NuevosEstados;
    }
    
    /**
     * Obtiene todas las prioridades disponibles para incidencias.
     *
     * @returns {Promise<Array>} Lista de prioridades
     */

    const todosPrioriInci = async()=>{
        const info = await conectar(`${urlBase}incidencia/todas/prioridades`,'GET',{},token)
        //console.log(info)
        const { prioridades } = info
        return prioridades;
    }
    
    /**
     * Cambia la prioridad de una incidencia.
     *
     * @param {string} nombre - Nombre de la nueva prioridad
     * @param {number|string} id - ID de la incidencia
     * @returns {Promise<Object>} Respuesta del backend
     */

    const cambiarPrioriInci = async(nombre, id)=>{
        const datos ={
            prioridad_nombre: nombre
        }
        const info = await conectar(`${urlBase}incidencia/${id}/prioridad`,'PUT',datos,token)
        //console.log(info);
        return info;
    }

    /**
     * Cambia el estado de una incidencia.
     *
     * @param {string} nombre - Nombre del nuevo estado
     * @param {number|string} id - ID de la incidencia
     * @returns {Promise<boolean>} true si la operación fue exitosa
     */

    const cambiarEstadoInci = async(nombre, id)=>{
        const datos ={
            estado_nombre: nombre
        }
        //console.log(datos)
        const info = await conectar(`${urlBase}incidencia/${id}/estado`,'PUT',datos,token)
        //console.log(info);
        const { ok, msg } = info
        setMensaje(msg);
        return ok;

    }
    /**
     * Crea una incidencia y sube archivos adjuntos si existen.
     *
     * @param {Object} param0
     * @param {Object} param0.incidencia - Datos de la incidencia
     * @param {File} [param0.fotoPrincipal] - Archivo de foto principal (opcional)
     * @param {File} [param0.archivoAdjunto] - Archivo adjunto (opcional)
     *
     * @returns {Promise<void>} Retorna una promesa que resuelve cuando se completan las operaciones
     */
    const crearIncidencia = async(datos)=>{
        //console.log(datos,"datoa en crear Incidencia")
        const info = await conectar(`${urlBase}incidencia/crear`,'POST',datos,token);
        //console.log(info);
        return info;
    }
    /**
     * Sube un archivo adjunto a una incidencia existente.
     *
     * @param {number|string} idIncidencia - ID de la incidencia
     * @param {File} archivo - Archivo a subir
     * @returns {Promise<Object>} Respuesta del backend
     */
    const subirArchivo = async(idIncidencia, archivo)=>{
        const fd = new FormData();
        fd.append('archivo', archivo);
        const info = await conectar(`${urlBase}incidencia/${idIncidencia}/archivo`, 'POST', fd, token);
        return info;
    }
    /**
     * Sube la foto principal de una incidencia.
     *
     * @param {number|string} idIncidencia - ID de la incidencia
     * @param {File} archivo - Imagen a subir
     * @returns {Promise<Object>} Respuesta del backend
     */
    const subirFotoPrincipal = async(idIncidencia, archivo)=>{
        const fd = new FormData();
        fd.append('archivo', archivo);
        const info = await conectar(`${urlBase}incidencia/${idIncidencia}/fotoPrincipal`, 'POST', fd, token);
        return info;
    }
    /**
     * Crea una incidencia y opcionalmente sube archivos asociados.
     *
     * @param {Object} param0
     * @param {Object} param0.incidencia - Datos de la incidencia
     * @param {File|null} param0.fotoPrincipal - Foto principal opcional
     * @param {File|null} param0.archivoAdjunto - Archivo adjunto opcional
     *
     * @returns {Promise<void>}
     */
    const crearIncidenciaConArchivos = async ({ incidencia, fotoPrincipal, archivoAdjunto }) => {
        //console.log(incidencia);
        //console.log(fotoPrincipal);
        //console.log(archivoAdjunto);
        // Crear la incidencia
        setError(null);
        const info = await crearIncidencia(incidencia);
        //console.log(info);
        const { msg, ok, errors } = info
        if(ok == true ){
            const { id_incidencia } = info.incidencia
            console.log(id_incidencia)
            setMensaje(msg);

            if (!id_incidencia) {
                setError("No se pudo obtener el ID de la incidencia");
            }

            // Subir foto principal (si hay)
            if (fotoPrincipal) {
            await subirFotoPrincipal(id_incidencia, fotoPrincipal);
            }

            // Subir archivo adjunto (si hay)
            if (archivoAdjunto) {
            await subirArchivo(id_incidencia, archivoAdjunto);
            }
            setError(null);
            const { id_maquina } = incidencia
            cambiarEstadoMaquina(id_maquina, 'Averiado')
        }else{
            setErrorSolo(msg);
            setError(errors)
        }
    };

    /**
     * Asigna un jefe a una incidencia.
     *
     * @param {number|string} id - ID de la incidencia
     * @param {number|string} id_jefe - ID del jefe a asignar
     * @returns {Promise<boolean>} true si la operación fue exitosa
     */

    const asignarJefe = async(id, id_jefe)=>{
        const dato ={
            id_jefe: id_jefe
        }
        const info = await conectar(`${urlBase}incidencia/${id}/asignar-jefe`,'PUT',dato,token);
        console.log(info);
        const {ok} = info;
        return ok;
    }

    /**
     * Asigna un técnico a una incidencia.
     *
     * @param {number|string} id - ID de la incidencia
     * @param {number|string} id_tecni - ID del técnico
     * @returns {Promise<void>}
     */


    const asignarTecnico = async(id, id_tecni)=>{
        const dato = {
            id_tecnico: id_tecni
        }
        console.log(dato);
        console.log(id);
        const info = await conectar(`${urlBase}incidencia/${id}/asignar-tecnico`,'PUT',dato,token);
    }

    /**
     * Crea un informe asociado a una incidencia.
     *
     * @param {Object} datos
     * @param {string} datos.texto - Contenido del informe
     * @param {string} datos.tipo - Tipo de informe
     * @param {number|string} datos.id_incidencia - ID de la incidencia
     * @param {number|string} datos.id_tecnico - ID del técnico que lo crea
     *
     * @returns {Promise<Object>} Respuesta del backend
     */


    const crearInforme = async({ texto, tipo, id_incidencia, id_tecnico })=>{
        const datos = {
            texto,
            tipo,
            id_incidencia,
            id_tecnico
        }
        const info = await conectar(`${urlBase}informe/crear`,'POST',datos,token);
        console.log(info);
        const { msg } = info
        setMensaje(msg)
        return info;
    }

    /**
     * Descarga un PDF con la información de la incidencia e informes asociados.
     *
     * @param {number|string} id - ID de la incidencia
     * @returns {Promise<Object>} Objeto indicando éxito o error
     */

    const descargarPdf = async (id) => {
        try {
            // urlBase debe terminar en / o no, URL() lo normaliza
            const downloadUrl = new URL(`informe/por-incidencia/${id}/pdf`, urlBase).toString();

            // pedir como blob
            const blobOrError = await conectar(downloadUrl, 'GET', {}, token, 'blob');

            // si conectar devolvió objeto error
            if (blobOrError && blobOrError.ok === false) {
            console.error('Error descargando PDF', blobOrError);
            return { ok: false, status: blobOrError.status, body: blobOrError.body };
            }

            const blob = blobOrError;
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `informe_incidencia_${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(blobUrl);

            return { ok: true };
        } catch (err) {
            console.error('Error descargando PDF', err);
            return { ok: false, error: err };
        }
    };

    /**
     * Limpia los errores almacenados en el estado del hook.
     */

    const limpiarErrores = ()=>{
        setError(null)
        setErrorSolo(null)
    }

    /**
     * Limpia el mensaje de éxito almacenado.
     */

    const limpiarMensaje = ()=>{
        setMensaje(null);
    }

  return {
    todasIncidencias,
    crearIncidencia,
    subirArchivo,
    subirFotoPrincipal,
    crearIncidenciaConArchivos,
    todosEstadosInci,
    todosPrioriInci,
    mensaje,
    error,
    errorSolo,
    limpiarErrores,
    IncidenciaPorId,
        obtenerInformesPorIncidencia,
    cambiarEstadoInci,
    cambiarPrioriInci,
    asignarJefe,
    asignarTecnico,
    crearInforme,
    descargarPdf,
    limpiarMensaje
  }
}
