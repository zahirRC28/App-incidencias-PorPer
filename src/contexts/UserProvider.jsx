import { useState } from "react"
import { UserContext } from "./UserContext"
import Cookies from 'js-cookie';

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() =>{
      const datos = Cookies.get('userData')
      return datos ? JSON.parse(datos) : null
    });
    const [token, setToken] = useState( Cookies.get('miToken') || null);

    const login = (userDatos, token) =>{
      //console.log(userDatos)
      //console.log(token)
      setUser(userDatos);
      setToken(token);
      //localStorage.setItem("token", token);
      Cookies.set('miToken', token, { expires: 1, path: '/' });
      Cookies.set('userData', JSON.stringify(userDatos), { expires: 1, path: '/' });
    };

    const logout = () =>{
      setUser(null)
      setToken(null)
      Cookies.remove('miToken');
      Cookies.remove('userData');
    }

  return (
    
    <UserContext.Provider value={{user, token, login, logout}}>
        {children}
    </UserContext.Provider>
  )
}