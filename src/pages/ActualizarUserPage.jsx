import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { userAuth } from "../hooks/userAuth";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import imgContra from "../assets/imgContra.svg";
import imgCorreo from "../assets/imgCorreo.svg";

/**
 * Página para actualizar un usuario del sistema.
 *
 * Funcionalidades:
 * - Carga los datos del usuario según su `id`.
 * - Permite actualizar nombre, correo, contraseña y rol.
 * - Muestra mensajes de error y éxito tras la actualización.
 *
 * @component
 * @returns {JSX.Element} Componente de actualización de usuario
 */
export const ActualizarUserPage = () => {
    const { id } = useParams();
    const { traerUsuario, actualizarUser, error, mensaje, todosRoles } = userAuth();
    const [usuario, setUsuario] = useState(
        {
            nombre_completo: "",
            correo: "",
            contrasenia_hash: "",
            id_rol: null
        }
    );
    const [formError, setFormError] = useState(null);
    const [roles, setRoles] = useState([])
    const [rolSeleccionado, setRolSeleccionado] = useState("");

    /**
   * Carga todos los roles disponibles
   */
    const cargandoRoles = async()=>{
        const datos = await todosRoles();
        setRoles(datos);
        //console.log(datos);
    }

    /**
   * Carga los datos del usuario según su ID
   */
    const cargarUsuario = async () => {
        const data = await traerUsuario(id);
        //console.log(data);
        setUsuario(data);
    };
    useEffect(() => {
        if (usuario && roles.length > 0) {
            //buscar el rol correspondiente al id_rol del usuario
            const rol = roles.find(r => r.id_rol === usuario.id_rol);
            //si se encuentra el rol, actualizar el estado del rol seleccionado
            if (rol) {
                setRolSeleccionado(rol.nombre);
            }
        }
    }, [usuario, roles]);
    useEffect(() => {
        cargandoRoles();
        cargarUsuario();
    }, [id]);

    //const buscandoRoles = (roles.find(rol => rol.id_rol === usuario.id_rol));
    //const rolUser = buscandoRoles ? buscandoRoles.nombre : '';
    //console.log(rolUser);

    /**
   * Maneja el envío del formulario para actualizar el usuario.
   * Valida campos obligatorios y llama a la función `actualizarUser`.
   *
   * @param {Event} ev Evento de envío del formulario
   */
    const handleSubmit = (ev) => {
        ev.preventDefault();
        const nombre = ev.target.nombre.value;
        const correo = ev.target.email.value;
        const rol = ev.target.rol.value;
        const contrasenia = ev.target.password.value;
        //console.log({ nombre, correo, contrasenia, rol });
        if (!correo || !nombre) {
            setFormError("Completa todos los campos");
            return
        }
        setFormError(null);
        const nuevoUser = {
            "id": id,
            "nombre":nombre,
            "correo":correo,
            "contrasenia":contrasenia,
            "rol":rol
        }
        actualizarUser(nuevoUser);
    }
    
  return (
    <>
        <h2>{`Actualizar Usuario:  ${usuario.nombre_completo}`}</h2>
        <form  onSubmit={handleSubmit}>
            <Input labeltext={"Nombre Completo:"} 
                type="text" name="nombre" 
                placeholder="escribe aqui tu nombre" 
                icon={<img src={imgCorreo} alt="nombre" />}
                valor={usuario.nombre_completo}
            />
            <Input labeltext={"Correo Electrónico:"} 
                type="text" name="email" 
                placeholder="tu@email.com"
                icon={<img src={imgCorreo} alt="Correo" />}
                valor={usuario.correo}
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
            {roles.length > 0 && (
                //usamos el onChange para actualizar el estado del rol seleccionado
            <select name="rol" className="select-rol" value={rolSeleccionado} onChange={(e) => setRolSeleccionado(e.target.value)}>
                {roles.map((rol) => (
                <option key={rol.id_rol} value={rol.nombre}>
                    {rol.nombre}
                </option>
                ))}
            </select>
            )}
            {formError && (
                <p className="error">{formError}</p>
            )}
            {error && (
                <p className="error">{error}</p>
            )}
            {mensaje && <p className="success">{mensaje}</p>}
            <Button text="Actualizar" type="submit" />
        </form>
            
    </>
    
  )
}
