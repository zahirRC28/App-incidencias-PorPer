import "../../styles/cards.css";
export const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className={`stat-card ${color}`}>
      <div>
        <p>{title}</p>
        <h3>{value}</h3>
      </div>
      <span className="stat-icon">{icon}</span>
    </div>
  );
};