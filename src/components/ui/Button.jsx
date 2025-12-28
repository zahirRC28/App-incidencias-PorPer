import "../../styles/button.css";

export const Button = ({ text, onClick, type = "button" }) => {
  return (
    <button className="btn-primary" type={type} onClick={onClick}>
      {text}
    </button>
  )
}
