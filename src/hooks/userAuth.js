import { useContext, useState } from "react";
import { jwtDecode } from "jwt-decode"
import { UserContext } from "../contexts/UserContext";
import conectar from "../helpers/fetch";

const urlBase = import.meta.env.VITE_BACKEND_URL;

export const userAuth = () => {

    const { login, logout, user, token } = useContext(UserContext);
    const [error, setError] = useState(null);
    const [mensaje, setMensaje] = useState(null);

     // ---------------- LOGIN ---------------- //
    const loginUser = async(datos) =>{
        //console.log(datos);
        const info = await conectar(`${urlBase}auth/login`, 'POST',datos);
        //console.log(info);
        const { user, token, ok} = info
        if(ok === true){
            login(user,token);
        }else{
            const errors = info.errors || info
            setError(errors)
            //console.log(error);
        }
    }
    
    const logoutUser = () =>{
        logout();
    }

    // ---------------- RENOVACION ----------------//
    const renewToken = async () => {
        const info = await conectar(`${urlBase}auth/renovar`, 'GET', {}, token);
        const { token: nuevoToken } = info
        //console.log(info);
        //console.log(nuevoToken);
        login(user, nuevoToken);
        
    };

    // ---------------- UTILIDADES ----------------//
    const getRole = () =>{
        if(!token) return null;
        try{
            const { rol, exp } = jwtDecode(token);
            // exp en segundos; compara con tiempo actual en ms
            if (typeof exp === 'number' && exp * 1000 <= Date.now()) {
                return null;
            }
            return rol;
        }catch{
            // token mal formado
            return null;
        }
    }

    // ---------------- USUARIOS ----------------//
    const todosUser = async()=>{
        const info = await conectar(`${urlBase}user/todosUsuarios/${user.uid}`,'GET',{},token);
        //----------renewToken();
        //console.log(info);
        const {usuarios} = info;
        console.log(usuarios);
        return usuarios;
    }
    const crearUsuario = async(datos) =>{
        //console.log(datos);
        const info = await conectar(`${urlBase}user/crear`,'POST',datos,token);
        console.log(info)
        const { ok , msg} = info;
        if(ok === true){
            setMensaje(msg);
            setError(null);
        }else{
            setError(info.msg || "Error al crear usuario");
        }
    }
    const traerUsuario = async(idUser)=>{
        const info = await conectar(`${urlBase}user/usuario/${idUser}`,'GET',{},token);
        //console.log(info);
        const { usuario } = info
        return usuario;
    }
    const todosRoles = async()=>{
        const info = await conectar(`${urlBase}user/todosRoles`,'GET',{},token);
        //console.log(info)
        const { roles } = info
        return roles;
    }

    const actualizarUser = async(datos)=>{
        console.log(datos);
        const info = await conectar(`${urlBase}user/actualizar/${datos.id}`,'PUT',datos,token)
        console.log(info);
        const { ok, msg} = info
        if(ok === true){
            setMensaje(msg);
            setError(null);
        }else{
            setError(info.msg || "Error al actualizar usuario");
        }
    }

    const eliminarUser = async(idUser, email)=>{
        //console.log(idUser);
        //console.log(email);
        const datos = {
            "correo": email
        }
        const info = await conectar(`${urlBase}user/eliminar/${idUser}`,'DELETE',datos,token)
        console.log(info);
        const { ok, msg } = info;
        if(ok === true){
            setMensaje(msg);
            setError(null)
        }
    }
    const estadoUser = async(idUser)=>{
        const info = await conectar(`${urlBase}user/cambiarEstado/${idUser}`,'PUT',{},token)
        console.log(info)
        const { ok, msg } = info
        if(ok == true){
            setMensaje(msg);
            setError(null);
        }
    }
    const userPoRole = async(nombreRol)=>{
        //console.log(nombreRol);
        const dato = {
            nombre: nombreRol
        }
        const info = await conectar(`${urlBase}user/porUserRol`,'POST',dato,token);
        //console.log(info);
        const { usuarios } = info
        //console.log(usuarios)
        return usuarios;
    }

    const limpiarMensaje = () => setMensaje(null);

  return {
    loginUser,
    logoutUser,
    user,
    error,
    getRole,
    token,
    todosUser,
    eliminarUser,
    todosRoles,
    traerUsuario,
    crearUsuario,
    actualizarUser,
    mensaje,
    estadoUser,
    limpiarMensaje,
    userPoRole
    }
}
