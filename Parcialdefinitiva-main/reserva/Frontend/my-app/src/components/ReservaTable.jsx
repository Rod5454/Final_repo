import React from 'react';
import '../App.css'; 

function ReservaTable({ reservations }) {
  return (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID Reserva</th>
            <th>Cliente</th>
            <th>Cancha</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(reservation => (
            <tr key={reservation.id}>
              <td>{reservation.id}</td>
              <td>{reservation.nombres} {reservation.apellidos}</td>
              <td>{reservation.cancha}</td>
              <td>{new Date(reservation.fecha).toLocaleDateString()}</td>
              <td>{reservation.hora}</td>
              <td>{reservation.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReservaTable;