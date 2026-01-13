import "../../styles/input.css";

/**
 * Componente Input
 *
 * Campo de entrada con etiqueta y posible ícono.
 *
 * @component
 * @param {Object} props
 * @param {string} props.labeltext - Texto de la etiqueta
 * @param {string} props.type - Tipo de input (text, password, email, etc.)
 * @param {string} props.placeholder - Placeholder del input
 * @param {string} props.name - Nombre del input
 * @param {React.ReactNode} [props.icon] - Ícono opcional dentro del input
 * @param {string} [props.valor] - Valor por defecto del input
 * @returns {JSX.Element} Campo de entrada renderizado
 *
 * @example
 * <Input labeltext="Correo" type="text" placeholder="tu@email.com" name="email" />
 */

export const Input = ({ labeltext, type, placeholder, name, icon, valor }) => {
  return (
    <>
      <label>{labeltext}</label>
      <div className="input-group">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          className="input"
          defaultValue={valor}
        />
      </div>
    </>
  )
}
