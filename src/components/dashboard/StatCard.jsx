import "../../styles/cards.css";
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