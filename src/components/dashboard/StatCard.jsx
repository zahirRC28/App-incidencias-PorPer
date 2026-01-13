import "../../styles/cards.css";

/**
 * Componente StatCard
 *
 * Muestra una tarjeta estadística con un título, valor e ícono, con color personalizado.
 *
 * @param {Object} props - Props del componente.
 * @param {string} props.title - Título de la tarjeta.
 * @param {string|number} props.value - Valor numérico o texto a mostrar.
 * @param {string} props.icon - Ruta de la imagen que representa el icono.
 * @param {string} props.color - Clase CSS que define el color de la tarjeta.
 *
 * @returns {JSX.Element} Componente renderizado de la tarjeta estadística.
 */

export const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className={`stat-card ${color}`} role="article">
      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <h3 className="stat-value">{value}</h3>
      </div>

      <img
        className="stat-icon"
        src={icon}
        alt={`Icono de ${title}`}
        loading="lazy"
      />
    </div>
  );
};