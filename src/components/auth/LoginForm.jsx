import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { userAuth } from "../../hooks/userAuth"
import { useState } from "react";
import "../../styles/authForm.css";
import imgCorreo from "../../assets/imgCorreo.svg";
import imgContra from "../../assets/imgContra.svg";
/**
 * Componente LoginForm
 *
 * Muestra un formulario de inicio de sesión para que los usuarios puedan autenticarse.
 *
 * @component
 * @example
 * return (
 *   <LoginForm />
 * )
 */

export const LoginForm = () => {
  const { loginUser, error } = userAuth();
  const [formError, setFormError] = useState(null);
   /**
   * Maneja el envío del formulario.
   *
   * Valida que los campos de correo y contraseña estén completos,
   * y luego llama a la función loginUser del hook userAuth.
   *
   * @param {React.FormEvent<HTMLFormElement>} ev Evento de envío del formulario
   * @returns {Promise<void>}
   */
  const handleSubmit = async(ev)=>{
    ev.preventDefault();
    const correo = ev.target.email.value;
    let contrasenia = ev.target.password.value;
    if (!correo || !contrasenia) {
      setFormError("Completa todos los campos");
      return
    }
    setFormError(null);
    const datos = { "correo": correo, "contrasenia": contrasenia };
    //console.log(datos);
    await loginUser(datos)
  }
  return (
    <>
      <h2>Iniciar Sesión</h2>
      <p>Ingresa tus credenciales para acceder</p>
      <form onSubmit={handleSubmit}>
        <Input labeltext={"Correo Electrónico"} type="text" name="email" placeholder="tu@email.com"
          icon={<img src={imgCorreo} alt="Correo" />}
        />
        {error?.correo && (
            <p className="error">{error.correo.msg}</p>
        )}
        <Input labeltext={"Contraseña"} type="text" name="password" placeholder="••••••••"
          icon={<img src={imgContra} alt="Contraseña" />}
        />
        {error?.contrasenia && (
            <p className="error">{error.contrasenia.msg}</p>
          )}
          {formError && (
            <p className="error">{formError}</p>
          )}
          {
            error &&(
              <p className="error">{error.msg}</p>
            )
          }
        <Button text="Ingresar" type="submit" />
      </form>
    </>
  )
}
