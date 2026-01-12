import { useEffect, useState } from "react";
import { userAuth } from "../hooks/userAuth";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { maquinas } from "../hooks/maquinas";

export const CrearMaquinaPage = () => {
    const { userPoRole } = userAuth();
    const { crearMaquina, mensaje } = maquinas();
    const [usersList, setUserList] = useState([]);
    const cargarDatos = async() =>{
      const datos = await userPoRole("Cliente");
      setUserList(datos);
    }
    useEffect(()=>{
      cargarDatos();
    }, [])

    const handleSubmit = async(ev)=> {
      ev.preventDefault();
      const nombreMaqui = ev.target.nombre.value;
      const modeloMaqui = ev.target.modelo.value;
      const priori = ev.target.prioridadRecomendada.value
      const userId = ev.target.id_usuario.value;
      const datos = {
        nombre: nombreMaqui,
        modelo: modeloMaqui,
        prioridad_cliente: priori,
        id_usuario: userId
      }
      //console.log(datos);
      await crearMaquina(datos)
    }
  
  return (
    <>
      <h2>Crear Maquina</h2>
      <form onSubmit={handleSubmit}>
        <Input labeltext={"Nombre Maquina:"} 
          type="text" name="nombre" 
          placeholder="escribe aqui el nombre" 
        />
        <Input labeltext={"Modelo Maquina:"} 
          type="text" name="modelo" 
          placeholder="escribe aqui el modelo de la maquina" 
        />
        <label>Prioridad Recomendada</label>
        <textarea name="prioridadRecomendada" rows={4} />
        <label>Usuario</label>
        <select name="id_usuario">
          <option value="">Selecciona usuario</option>
          {usersList.map((user, index)=>(
            <option key={index} id={user.id_usuario} value={user.id_usuario}>{user.nombre_completo}---{user.correo}</option>
          ))}
        </select>
        <Button text="Crear Maquina" type="submit"/>
        {mensaje && <p className="success">{mensaje}</p>}
      </form>
    </>
  )
}
