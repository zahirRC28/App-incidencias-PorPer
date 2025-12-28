import imgLogo from "../../assets/reparar.svg";
import "../../styles/logo.css";
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
