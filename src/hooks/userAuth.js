import { useContext, useState } from "react";
import conectar from "../helpers/fetch";
import { UserContext } from "../contexts/UserContext";
import { jwtDecode } from "jwt-decode"

const urlBase = import.meta.env.VITE_BACKEND_URL;

export const userAuth = () => {

    const { login, logout, user, token } = useContext(UserContext);
    const [error, setError] = useState(null);
    const [mensaje, setMensaje] = useState(null);
    //console.log(user);
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

    const getRole = () =>{
        const { rol } = jwtDecode(token)
        return rol
    }

    const todosUser = async()=>{
        const info = await conectar(`${urlBase}user/todosUsuarios/${user.uid}`,'GET',{},token);
        //console.log(info);
        const {usuarios} = info;
        //console.log(usuarios);
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
    }

   
 
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
    mensaje
    }
}
