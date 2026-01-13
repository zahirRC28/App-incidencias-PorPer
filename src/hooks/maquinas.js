import conectar from "../helpers/fetch";
import { jwtDecode } from "jwt-decode"
import { userAuth } from "./userAuth";
import { useState } from "react";
const urlBase = import.meta.env.VITE_BACKEND_URL;

export const maquinas = () => {
    const { getRole, token } = userAuth();
    //console.log(token);
    const { uid } = jwtDecode(token);
    const userRol = getRole();
    const [mensaje, setMensaje] = useState(null);
    //console.log(uid);
    const todasMaquinas = async (userid = null) => {
    try {
        let info;
        // Admin, Jefe o Técnico → todas las máquinas
        if (['Administrador', 'Jefe', 'Tecnico'].includes(userRol) && !userid) {
            info = await conectar(`${urlBase}maquina/todas`, 'GET', {}, token);
        }
        // Cliente → máquinas por usuario
        else if (userRol === 'Cliente' || userRol=== 'Administrador') {
          const idCliente = userid ?? uid;

          info = await conectar(`${urlBase}maquina/porUsuario/${idCliente}`, 'GET', {}, token); 
        }
        // Seguridad: si no hay respuesta válida
        if (!info || info.ok === false) {
            return [];
        }

        return info.maquinas ?? [];

    } catch (error) {
        console.error('Error al cargar máquinas:', error);
        return [];
    }
};
    const cambiarEstadoMaquina = async(id,nombre)=>{
      //console.log(nombre);
      const data = {
        estado_nombre: nombre
      }
      const info = await conectar(`${urlBase}maquina/${id}/estado`,'PUT',data, token);
      console.log(info);
      return info
    }

    const crearMaquina = async(datos)=>{
      const info = await conectar(`${urlBase}maquina/crear`,'POST',datos, token);
      //console.log(info);
      const { msg } = info
      setMensaje(msg);
      //return info
    }

    const actualizarMaquina = async (id, datos) => {
      //console.log(datos);
      //console.log(id);
      const info = await conectar(`${urlBase}maquina/actualizar/${id}`,'PUT',datos,token
      );
      console.log(info);
      if (info?.msg) {
        setMensaje(info.msg);
      }

      return info;
    };

    const buscarMaquinaID = async (id) => {
      const info = await conectar(`${urlBase}maquina/maquina/${id}`,'GET',{},token);
      return info?.maquina ?? info;
    };
    const eliminarMaquina = async(id)=>{
      const info = await conectar(`${urlBase}maquina/eliminar/${id}`,'DELETE',{},token);
      const { msg } = info
      if(msg){
        setMensaje(msg);
      }
      return info
    }

  return {
    todasMaquinas,
    cambiarEstadoMaquina,
    crearMaquina,
    mensaje,
    actualizarMaquina,
    buscarMaquinaID,
    eliminarMaquina
  }
}
