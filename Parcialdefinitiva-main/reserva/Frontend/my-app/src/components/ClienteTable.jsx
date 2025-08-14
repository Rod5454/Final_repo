import React from 'react';
import '../App.css';

function ClienteTable({ clientes, onEditClick, onDeleteClick }) {
  return (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>DNI</th>
            <th>Correo Electrónico</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(cliente => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.nombres}</td>
              <td>{cliente.apellidos}</td>
              <td>{cliente.dni}</td>
              <td>{cliente.email}</td>
              <td>{cliente.telefono}</td>
              <td className="admin-actions">
                <button onClick={() => onEditClick(cliente)} className="btn-edit">Editar</button>
                <button onClick={() => onDeleteClick(cliente.id)} className="btn-delete">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClienteTable;