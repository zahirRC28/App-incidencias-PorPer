import imgLogo from "../../assets/reparar.svg";
import "../../styles/logo.css";

/**
 * Componente Logo
 *
 * Muestra el logo de la aplicación con ícono y texto.
 *
 * @component
 * @returns {JSX.Element} Logo de la app
 *
 * @example
 * <Logo />
 */

export const Logo = () => {
  return (
    <div className="logo">
      <span className="logo-icon">
        <img src={imgLogo} alt="Logo" />
      </span>
      <h2>GMAO</h2>
    </div>
  )
}
