import React from 'react';
import '../App.css';

function ClienteFormModal({ isOpen, onClose, formData, onChange, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Editar Cliente</h3>
        <form onSubmit={onSubmit} className="form-admin">
          <label>Nombres</label>
          <input
            type="text"
            name="nombres"
            value={formData.nombres}
            onChange={onChange}
            required
          />
          <label>Apellidos</label>
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={onChange}
            required
          />
          <label>DNI</label>
          <input
            type="text"
            name="dni"
            value={formData.dni}
            onChange={onChange}
            required
          />
          <label>Correo Electrónico</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            required
          />
          <label>Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
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

export default ClienteFormModal;