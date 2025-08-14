
import React from 'react';


function CanchaCard({ cancha, onReservarClick }) {
  return (
    <div key={cancha.ID} className="cancha-card">
      <img src={cancha.IMAGEN} alt={cancha.NOMBRE} className="cancha-image" />
      <h3 className="cancha-name">{cancha.NOMBRE}</h3>
      <p className="cancha-detail">Público general: S/ {cancha.PRECIO_GENERAL}</p>
      <p className="cancha-detail">Jugadores: {cancha.JUGADORES}</p>
      <p className="cancha-detail">Duración: {cancha.DURACION}</p>
      <button
        onClick={() => onReservarClick(cancha)}
        className="btn-reserve"
      >
        Reservar
      </button>
    </div>
  );
}

export default CanchaCard;
