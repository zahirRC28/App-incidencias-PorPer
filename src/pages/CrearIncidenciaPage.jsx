import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import { maquinas } from "../hooks/maquinas";
import { incidencias } from "../hooks/incidencias";
import { Input } from "../components/ui/Input";
import { userAuth } from "../hooks/userAuth";
import '../styles/pages/CrearIncidenciaPage.css';

export const CrearIncidenciaPage = () => {
    const { todasMaquinas } = maquinas();
    const { crearIncidenciaConArchivos, mensaje, errorSolo, limpiarErrores } = incidencias();
    const { getRole, token, userPoRole } = userAuth();

    const { uid } = jwtDecode(token);
    const rol = getRole();

    const [maquinasList, setMaquinasList] = useState([]);
    const [usersList, setUserList] = useState([]);
    const [mensajePage, setMensajePage]= useState(null);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    const [principalFile, setPrincipalFile] = useState(null);
    const [adjuntoFile, setAdjuntoFile] = useState(null);


    //console.log(error);

    const cargadorDatos = async () => {
      if (rol === "Administrador") {
        const dataUsers = await userPoRole("Cliente");
        //console.log(dataUsers);
        setUserList(dataUsers ?? []);
        setMaquinasList([]); // vacío hasta elegir usuario
      } else {
        const dataMaqui = await todasMaquinas();
        setMaquinasList(dataMaqui ?? []);
      }
    };

    useEffect(() => {
      cargadorDatos();
    }, []);


    const handleSubmit = async (ev) => {
        ev.preventDefault();
        setMensajePage(null);
        limpiarErrores();
        const titulo = ev.target.titulo.value;
        const descripcion = ev.target.descripcion.value;
        const id_maquina = ev.target.id_maquina.value;
        
        // Solo admin puede elegir usuario
        const id_usuario = rol === "Administrador" ? ev.target.id_usuario.value: uid;

        if (!titulo || !descripcion || !id_maquina) {
          setMensajePage("Completa título, descripción y máquina.");
          return;
        }

        await crearIncidenciaConArchivos({
          incidencia: {
            titulo,
            descripcion,
            id_maquina: id_maquina,
            id_usuario: id_usuario
          },
          fotoPrincipal: principalFile,
          archivoAdjunto: adjuntoFile
        });
    };
    const handleUserChange = async (ev) => {
      const userId = ev.target.value;
      setUsuarioSeleccionado(userId);
      if (!userId) {
        setMaquinasList([]);
        return;
      }
      const dataMaqui = await todasMaquinas(userId);
      setMaquinasList(dataMaqui ?? []);
    };

    return (
      <>
          <h2>Crear Incidencia</h2>

        <form onSubmit={handleSubmit} className="incidenciaCrear">
          <Input
            labeltext="Título Incidencia"
            type="text"
            name="titulo"
            placeholder="Escribe el título"
          />

          <label>Descripción</label>
          <textarea name="descripcion" rows={4} />

          {/* SOLO ADMIN */}
          {rol === "Administrador" && (
            <>
              <label>Usuario</label>
              <select name="id_usuario" onChange={handleUserChange}>
                <option value="">Selecciona usuario</option>
                {usersList.map((user, index)=>(
                  <option key={index} id={user.id_usuario} value={user.id_usuario}>{user.nombre_completo}---{user.correo}</option>
                ))}
              </select>
            </>
          )}

          <label>Máquina</label>
          <select name="id_maquina">
            <option value="">Selecciona una máquina</option>
            {maquinasList.map((maqui, index) => (
              <option key={index} id={maqui.id_maquina} value={maqui.id_maquina}>{maqui.nombre}---{maqui.estado_nombre}</option>
            ))}
          </select>

          <label>Foto Principal</label>
          <input
          type="file"
          //para que solo se pueda subir un tipo imagen
          accept="image/*"
          onChange={(e) => setPrincipalFile(e.target.files[0])}
          />

          <label>Archivo Adjunto</label>
          <input
          type="file"
          onChange={(e) => setAdjuntoFile(e.target.files[0])}
          />
          {/*<button type="button" onClick={handleLimpiar} >Limpar Archivos</button>*/}
          <button type="submit">Crear Incidencia</button>
        </form>
        {mensaje && <p className="success">{mensaje}</p>}
        {mensajePage && <p className="Error">{mensajePage}</p>}
        {errorSolo && <p className="Error">{errorSolo}</p>}
      </>
    )
}
