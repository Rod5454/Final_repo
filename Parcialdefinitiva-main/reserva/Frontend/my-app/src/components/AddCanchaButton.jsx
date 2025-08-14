import React from 'react';
import '../App.css';

function AddCanchaButton({ onClick }) {
  return (
    <button onClick={onClick} className="btn-primary">
      Agregar Nueva Cancha
    </button>
  );
}

export default AddCanchaButton;