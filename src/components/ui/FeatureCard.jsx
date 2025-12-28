import "../../styles/featureCard.css";

export const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="feature-card">
      <div className="feature-icon">
        <img src={icon} alt={title} />
      </div>

      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}
