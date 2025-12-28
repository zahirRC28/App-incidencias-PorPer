import { useState } from "react";
import { NavLink } from "react-router-dom"
import { userAuth } from "../../hooks/userAuth";
import "../../styles/sidebar.css";
import dashboarndIcon from "../../assets/dashboard/dashboardIcon.svg";
import configuracionIcon from "../../assets/dashboard/configuracionIcon.svg";
import incidenciasIcon from "../../assets/dashboard/incidenciasIcon.svg";
import mantenimientosIcon from "../../assets/dashboard/mantenimientoIcon.svg";
import maquinasIcon from "../../assets/dashboard/maquinasIcon.svg";
import menuIcon from "../../assets/reparar.svg";
import usuariosIcon from "../../assets/dashboard/usuariosIcon.svg";
import salirIcon from "../../assets/dashboard/salirIcon.svg";
import { Logo } from '../ui/Logo';

export const Sidebar = ({}) => {
  const { logoutUser, user } = userAuth();
  //console.log(logoutUser);
  const datosUser = user;
  //console.log(datosUser.nombre);
  const [collapsed, setCollapsed] = useState(false);

  return (
    //Si tiene el nombre de la clase "collapsed", se aplica el estilo para que cambie el sidebar
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      
      <div className="sidebar-header">
        <button className="menu-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed && <img src={menuIcon} alt="menu" className="logoColapsado" />}
          {!collapsed && <Logo/>}
        </button>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" className="nav-item">
          <img src={dashboarndIcon} /><span>Dashboard</span>
        </NavLink>
        {datosUser.rol === 'Administrador' && (
          <NavLink to="/usuarios" className="nav-item">
            <img src={usuariosIcon} /><span>Usuarios</span>
          </NavLink>
        )}
        {(datosUser.rol === 'Administrador' || datosUser.rol === 'Cliente') && (
          <NavLink to="/maquinas" className="nav-item">
            <img src={maquinasIcon} /><span>Máquinas</span>
          </NavLink>
        )}
        {(datosUser.rol === 'Administrador' || datosUser.rol === 'Cliente' || datosUser.rol === 'Jefe')&& (
          <NavLink to="/incidencias" className="nav-item">
            <img src={incidenciasIcon} /><span>Incidencias</span>
          </NavLink>
        )}
        {(datosUser.rol === 'Administrador' || datosUser.rol === 'Jefe')&& (
          <NavLink to="/mantenimientos" className="nav-item">
          <img src={mantenimientosIcon} /><span>Mantenimientos</span>
        </NavLink>
        )}
        <NavLink to="/configuracion" className="nav-item">
          <img src={configuracionIcon} /><span>Configuración</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <div className="user-info">
            <p className="user-name">{datosUser?.nombre}</p>
            <p className="user-role">{datosUser?.rol}</p>
          </div>
        )}
        <button className="logout" onClick={logoutUser}>
          <img src={salirIcon} alt="salir" />
          {!collapsed && <span className="logout-text">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};