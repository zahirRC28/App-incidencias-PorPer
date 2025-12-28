import { Navigate } from "react-router-dom";
import { userAuth } from "../../hooks/userAuth";

export const PublicProtection = ({ children }) => {
  const { token, getRole } = userAuth();

  
  if (token) {
    const role = getRole();
    //console.log(role);
    const roleToRoute = {
      Administrador: "/admin",
      Jefe: "/jefe",
      Tecnico: "/tecnico",
      Cliente: "/cliente",
    };

    const target = roleToRoute[role] || "/";
    return <Navigate to={target} replace />;
  }

  return children;
}