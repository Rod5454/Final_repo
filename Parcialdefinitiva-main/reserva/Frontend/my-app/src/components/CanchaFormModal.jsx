import React from 'react';
import '../App.css';

function CanchaFormModal({ isOpen, onClose, formData, onChange, onSubmit, currentCancha }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{currentCancha ? 'Editar Cancha' : 'Agregar Cancha'}</h3>
        <form onSubmit={onSubmit} className="form-admin">
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={onChange}
            required
          />
          <label>URL de Imagen</label>
          <input
            type="text"
            name="imagen"
            value={formData.imagen}
            onChange={onChange}
            required
          />
          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={onChange}
            required
          />
          <label>Precio</label>
          <input
            type="number"
            name="precio_general"
            value={formData.precio_general}
            onChange={onChange}
            required
          />
          <label>Jugadores</label>
          <input
            type="text"
            name="jugadores"
            value={formData.jugadores}
            onChange={onChange}
            required
          />
          <label>Duración</label>
          <input
            type="text"
            name="duracion"
            value={formData.duracion}
            onChange={onChange}
            required
          />
          <div className="modal-actions">
            <button type="submit" className="btn-primary">Guardar</button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CanchaFormModal;