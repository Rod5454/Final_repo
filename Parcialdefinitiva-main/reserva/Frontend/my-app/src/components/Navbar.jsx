import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">ARENA 7</div>
      <ul className="nav-links">
        <li><Link to="/">Inicio</Link></li>
        
        {user && user.is_admin !== 1 && (
          <>
            <li><Link to="/catalog">Catálogo</Link></li>
            <li><Link to="/my-reservations">Mis Reservas</Link></li>
          </>
        )}
        
        {!user && (
          <li><Link to="/catalog">Catálogo</Link></li>
        )}

        {user && user.is_admin === 1 && (
          <>
            <li><Link to="/admin/clientes">Clientes</Link></li>
            <li><Link to="/admin/reservas">Reservas de clientes</Link></li>
            <li><Link to="/admin/canchas">Administrar canchas</Link></li>
          </>
        )}
      </ul>
      <div className="nav-auth-buttons">
        {user ? (
          <>
            <span className="user-name">{user.nombres}</span>
            <button onClick={onLogout} className="btn-access">Cerrar Sesión</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-access">Acceso</Link>
            <Link to="/register" className="btn-register">Registro</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;