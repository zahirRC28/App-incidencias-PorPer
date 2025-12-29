import "../../styles/table.css";
import { useNavigate } from "react-router-dom";

export const DataTable = ({ title, columnas, data, onClickInfo , todos, limit}) => {
  //con eso puedo configurar cuantos datos mostrar en la tabla con slice ya que extrae dependiedo de los parametros
  const visibleData = limit ? data.slice(0, limit) : data;
  //console.log(datos);
  const navigate = useNavigate();
  return (
    <div className="table-card">
      <div className="table-header">
        <h3>{title}</h3>
        {todos &&
          <button onClick={() => navigate(todos)} >Ver todos</button>
        }
      </div>

      <table>
        <thead>
          <tr>
            {columnas.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/*Mapeao lo datos y las columnas que necesito*/}
          {visibleData.map((row, index) => (
            <tr key={index} onClick={() => onClickInfo?.(row)}>
              {columnas.map(col => (
                <td key={col.key}>
                  {col.render? col.render(row): row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
