import "../../styles/button.css";

/**
 * Componente Button
 *
 * Botón reutilizable con texto y acción al hacer clic.
 *
 * @component
 * @param {Object} props
 * @param {string} props.text - Texto que se mostrará en el botón
 * @param {Function} props.onClick - Función que se ejecuta al hacer clic
 * @param {string} [props.type="button"] - Tipo de botón (button, submit, reset)
 * @returns {JSX.Element} Botón renderizado
 *
 * @example
 * <Button text="Enviar" onClick={handleSubmit} type="submit" />
 */

export const Button = ({ text, onClick, type = "button" }) => {
  return (
    <button className="btn-primary" type={type} onClick={onClick}>
      {text}
    </button>
  )
}
