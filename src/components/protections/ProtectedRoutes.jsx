import { userAuth } from '../../hooks/userAuth';
import { Navigate } from "react-router-dom";

export const ProtectedRoutes = ({ children, roles }) => {
  const { getRole, token } = userAuth();
    
    if(!token) return <Navigate to="/" />;

    const userRol = getRole();

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
