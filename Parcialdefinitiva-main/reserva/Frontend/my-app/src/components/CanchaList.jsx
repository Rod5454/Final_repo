import React from 'react';
import CanchaCard from './CanchaCard'; 

function CanchaList({ canchas, onReservarClick }) {
  return (
    <div className="canchas-list">
      {canchas.map((cancha) => (
        <CanchaCard
          key={cancha.id}
          cancha={cancha}
          onReservarClick={onReservarClick}
        />
      ))}
    </div>
  );
}

export default CanchaList;