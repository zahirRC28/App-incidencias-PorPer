import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { userAuth } from "../hooks/userAuth";
import { maquinas } from "../hooks/maquinas";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export const ActualizarMaquinaPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { userPoRole } = userAuth();
    const { buscarMaquinaID, actualizarMaquina, mensaje, error } = maquinas();

    const [maquina, setMaquina] = useState({
        nombre: "",
        modelo: "",
        prioridad_cliente: "",
        id_usuario: "",
        estado_nombre: ""
    });

    const [usuarios, setUsuarios] = useState([]);
    const [formError, setFormError] = useState(null);
    const [loading, setLoading] = useState(true);

    const cargarDatos = async () => {
        try {
        const dataMaquina = await buscarMaquinaID(id);
        const dataUsuarios = await userPoRole("Cliente");

        setMaquina({
            nombre: dataMaquina.nombre ?? "",
            modelo: dataMaquina.modelo ?? "",
            prioridad_cliente: dataMaquina.prioridad_cliente ?? "",
            id_usuario: dataMaquina.id_usuario ?? "",
            estado_nombre: dataMaquina.estado_nombre ?? "Funcionando"
        });

        setUsuarios(dataUsuarios ?? []);
        } catch (err) {
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [id]);

    const handleSubmit = async (ev) => {
        ev.preventDefault();

        const nombre = ev.target.nombre.value;
        const modelo = ev.target.modelo.value;
        const prioridad_cliente = ev.target.prioridad_cliente.value;
        const id_usuario = ev.target.id_usuario.value;

        if (!nombre || !modelo) {
        setFormError("Nombre y modelo son obligatorios");
        return;
        }

        setFormError(null);

        const datos = {
        nombre,
        modelo,
        prioridad_cliente,
        id_usuario,
        estado_nombre: maquina.estado_nombre
        };

        await actualizarMaquina(id, datos);
    };

    if (loading) return <p>Cargando máquina...</p>;

  return (
    <>
      <h2>Actualizar Máquina: {maquina.nombre}</h2>

      <form onSubmit={handleSubmit}>
        <Input
          labeltext="Nombre Máquina"
          type="text"
          name="nombre"
          valor={maquina.nombre}
        />

        <Input
          labeltext="Modelo Máquina"
          type="text"
          name="modelo"
          valor={maquina.modelo}
        />

        <label>Prioridad Recomendada</label>
        <textarea
          name="prioridad_cliente"
          rows={4}
          defaultValue={maquina.prioridad_cliente}
        />

        <label>Usuario</label>
        <select name="id_usuario" defaultValue={maquina.id_usuario}>
          <option value="">Selecciona usuario</option>
          {usuarios.map((user) => (
            <option key={user.id_usuario} value={user.id_usuario}>
              {user.nombre_completo} — {user.correo}
            </option>
          ))}
        </select>

        {formError && <p className="error">{formError}</p>}
        {error && <p className="error">{error}</p>}
        {mensaje && <p className="success">{mensaje}</p>}

        <Button text="Actualizar" type="submit" />
        <Button text="Cancelar" type="button" onClick={() => navigate(-1)} />
      </form>
    </>
  )
}
