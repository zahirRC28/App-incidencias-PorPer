import "../../styles/table.css";

export const UsersTable = ({ onUserClick }) => {
  const users = [
    { name: "Carlos García", role: "Administrador", email: "admin@incidencias.com" },
    { name: "María López", role: "Jefe", email: "jefe@incidencias.com" },
    { name: "Pedro Martínez", role: "Técnico", email: "tecnico1@incidencias.com" },
  ];

  return (
    <div className="table-card">
      <div className="table-header">
        <h3>Usuarios del Sistema</h3>
        <button>Ver todos</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i} onClick={() => onUserClick(u)}>
              <td>{u.name}</td>
              <td><span className={`badge ${u.role.toLowerCase()}`}>{u.role}</span></td>
              <td>{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};