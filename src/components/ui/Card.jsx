/**
 * Componente Card
 *
 * Contenedor genérico para contenido con estilo de tarjeta.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido que se mostrará dentro de la tarjeta
 * @returns {JSX.Element} Tarjeta renderizada
 *
 * @example
 * <Card>
 *   <p>Contenido de la tarjeta</p>
 * </Card>
 */

export const Card = ({ children }) => {
  return <div className="card">{children}</div>;
}
