import "../../styles/featureCard.css";

/**
 * Componente FeatureCard
 *
 * Tarjeta para mostrar una característica o función, con ícono, título y descripción.
 *
 * @component
 * @param {Object} props
 * @param {string} props.icon - URL del ícono a mostrar
 * @param {string} props.title - Título de la característica
 * @param {string} props.description - Descripción de la característica
 * @returns {JSX.Element} Tarjeta de característica
 *
 * @example
 * <FeatureCard icon="/img/icon.png" title="Rapidez" description="Procesos rápidos y eficientes" />
 */

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
