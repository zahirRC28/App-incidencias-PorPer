import { useEffect, useState } from "react";
import imgContra from "../assets/imgContra.svg";
import imgCorreo from "../assets/imgCorreo.svg";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input"
import { userAuth } from "../hooks/userAuth";
import "../styles/pages/crearUser.css";


export const CrearUserPage = () => {
    const { todosRoles, crearUsuario, error, mensaje } = userAuth();
    const [roles, setRoles] = useState([])
    const [formError, setFormError] = useState(null);
    const cargandoRoles = async()=>{
        const datos = await todosRoles();
        setRoles(datos);
        //console.log(datos);
    }
    useEffect(()=>{
        cargandoRoles()
    }, [])

    const handleSubmit = (ev) => {
        ev.preventDefault();
        const nombre = ev.target.nombre.value;
        const correo = ev.target.email.value;
        const contrasenia = ev.target.password.value;
        const rol = ev.target.rol.value;
        //console.log({ nombre, correo, contrasenia, rol });
        if (!correo || !contrasenia) {
            setFormError("Completa todos los campos");
            return
        }
        setFormError(null);
        const datos = {
            "nombre":nombre,
            "correo":correo,
            "contrasenia":contrasenia,
            "rol":rol
        }
        crearUsuario(datos);
    }
    
     return (
        <>
            <h2>Crear Usuario</h2>
            <form  onSubmit={handleSubmit}>
                <Input labeltext={"Nombre Completo:"} 
                type="text" name="nombre" 
                placeholder="escribe aqui tu nombre"
                />
                <Input labeltext={"Correo Electrónico:"} 
                    type="text" name="email" 
                    placeholder="tu@email.com"
                icon={<img src={imgCorreo} alt="Correo" />}
                />
                {error?.correo && (
                    <p className="error">{error.correo.msg}</p>
                )}
                <Input labeltext={"Contraseña:"} 
                    type="text" name="password" 
                    placeholder="••••••••"
                icon={<img src={imgContra} alt="Contraseña" />}
                />
                {error?.contrasenia && (
                    <p className="error">{error.contrasenia.msg}</p>
                )}
                <p>Roles:</p>
                <select name="rol" className="select-rol">
                    {
                        roles.map((rol, index)=>(
                            <option key={index} id={rol.id_rol} value={rol.nombre}>{rol.nombre}</option>
                        ))
                    }
                </select>
                {formError && (
                    <p className="error">{formError}</p>
                )}
                {error && (
                    <p className="error">{error}</p>
                )}
                {mensaje && <p className="success">{mensaje}</p>}
                <Button text="Crear Usuario" type="submit" />
            </form>
        
        </>
  )
}
