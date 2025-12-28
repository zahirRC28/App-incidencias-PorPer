import { useContext, useState } from "react";
import conectar from "../helpers/fetch";
import { UserContext } from "../contexts/UserContext";
import { jwtDecode } from "jwt-decode"

const urlBase = import.meta.env.VITE_BACKEND_URL;

export const userAuth = () => {

    const { login, logout, user, token } = useContext(UserContext);
    const [error, setError] = useState(null);
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
 
  return {
    loginUser,
    logoutUser,
    user,
    error,
    getRole,
    token
    }
}
