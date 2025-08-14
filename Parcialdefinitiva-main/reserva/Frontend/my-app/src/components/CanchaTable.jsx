import React from 'react';
import '../App.css';

function CanchaTable({ canchas, onEditClick, onDeleteClick }) {
  return (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Jugadores</th>
            <th>Duración</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {canchas.map((cancha) => (
            <tr key={cancha.ID}>
              <td>{cancha.ID}</td>
              <td>{cancha.NOMBRE}</td>
              <td>{cancha.DESCRIPCION}</td>
              <td>S/ {cancha.PRECIO_GENERAL}</td>
              <td>{cancha.JUGADORES}</td>
              <td>{cancha.DURACION}</td>
              <td className="admin-actions">
                <button onClick={() => onEditClick(cancha)} className="btn-edit">Editar</button>
                <button onClick={() => onDeleteClick(cancha.ID)} className="btn-delete">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CanchaTable;