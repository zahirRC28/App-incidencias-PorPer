import { userAuth } from '../../hooks/userAuth';
import { Navigate } from "react-router-dom";
import { useEffect } from 'react';

export const ProtectedRoutes = ({ children, roles }) => {
  const { getRole, token, logoutUser } = userAuth();

    const userRol = getRole();
    // Asegura que los hooks se llamen SIEMPRE antes de cualquier return
    useEffect(() => {
      if (token && !userRol) {
        logoutUser();
      }
    }, [token, userRol]);

    if(!token) return <Navigate to="/" replace />;
    if(!userRol) return <Navigate to="/" replace />;

    const roleToRoute = {
      Administrador: "/admin",
      Jefe: "/jefe",
      Tecnico: "/tecnico",
      Cliente: "/cliente",
    };
    
    if (token && roles && !roles.includes(userRol)) {
        const target = roleToRoute[userRol] || "/";
        return <Navigate to={target} replace />;
    }
  return children
}
