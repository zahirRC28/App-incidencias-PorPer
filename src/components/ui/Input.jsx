import "../../styles/input.css";

export const Input = ({ labeltext, type, placeholder, name, icon }) => {
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
        />
      </div>
    </>
  )
}
