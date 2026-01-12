import conectar from "../helpers/fetch";
import { useState } from "react";
import { jwtDecode } from "jwt-decode"
import { userAuth } from "./userAuth";
import { maquinas } from "./maquinas";
const urlBase = import.meta.env.VITE_BACKEND_URL;

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
    const IncidenciaPorId = async(id)=>{
        const info = await conectar(`${urlBase}incidencia/${id}`,'GET',{},token);
        //console.log(info);
        const { incidencia } = info;
        return incidencia;
    }

    const obtenerInformesPorIncidencia = async(id)=>{
        const info = await conectar(`${urlBase}informe/por-incidencia/${id}`,'GET',{},token);
        const { ok, informes } = info
        if (ok !== false){
            return informes;
        }
    }

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
    
    const todosPrioriInci = async()=>{
        const info = await conectar(`${urlBase}incidencia/todas/prioridades`,'GET',{},token)
        //console.log(info)
        const { prioridades } = info
        return prioridades;
    }
    
    const cambiarPrioriInci = async(nombre, id)=>{
        const datos ={
            prioridad_nombre: nombre
        }
        const info = await conectar(`${urlBase}incidencia/${id}/prioridad`,'PUT',datos,token)
        //console.log(info);
        return info;
    }
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

    const crearIncidencia = async(datos)=>{
        //console.log(datos,"datoa en crear Incidencia")
        const info = await conectar(`${urlBase}incidencia/crear`,'POST',datos,token);
        //console.log(info);
        return info;
    }

    const subirArchivo = async(idIncidencia, archivo)=>{
        const fd = new FormData();
        fd.append('archivo', archivo);
        const info = await conectar(`${urlBase}incidencia/${idIncidencia}/archivo`, 'POST', fd, token);
        return info;
    }

    const subirFotoPrincipal = async(idIncidencia, archivo)=>{
        const fd = new FormData();
        fd.append('archivo', archivo);
        const info = await conectar(`${urlBase}incidencia/${idIncidencia}/fotoPrincipal`, 'POST', fd, token);
        return info;
    }

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
    const asignarJefe = async(id, id_jefe)=>{
        const dato ={
            id_jefe: id_jefe
        }
        const info = await conectar(`${urlBase}incidencia/${id}/asignar-jefe`,'PUT',dato,token);
        console.log(info);
        const {ok} = info;
        return ok;
    }
    const asignarTecnico = async(id, id_tecni)=>{
        const dato = {
            id_tecnico: id_tecni
        }
        console.log(dato);
        console.log(id);
        const info = await conectar(`${urlBase}incidencia/${id}/asignar-tecnico`,'PUT',dato,token);
    }

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

    const limpiarErrores = ()=>{
        setError(null)
        setErrorSolo(null)
    }
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
