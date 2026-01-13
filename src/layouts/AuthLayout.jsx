import "../styles/pages/layout.css";

/**
 * Layout para páginas de autenticación (login, registro, etc.).
 *
 * Divide la pantalla en dos secciones:
 * - left: contenido izquierdo (por ejemplo, imagen, texto promocional)
 * - right: contenido derecho (formulario de login/registro)
 *
 * @component
 * @param {Object} props
 * @param {JSX.Element} props.left Contenido a mostrar en la parte izquierda
 * @param {JSX.Element} props.right Contenido a mostrar en la parte derecha
 * @returns {JSX.Element} Layout de autenticación
 */

export const AuthLayout = ({ left, right }) => {
  return (
    <div className="auth-container">
      <div className="auth-left">
        {left}
      </div>
      <div className="auth-right">
        {right}
      </div>
    </div>
  )
}
