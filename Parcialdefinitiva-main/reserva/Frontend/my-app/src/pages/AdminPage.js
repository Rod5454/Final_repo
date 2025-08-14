import React from 'react';
import Navbar from '../components/Navbar';

import { useAuth } from '../context/AuthContext';

function AdminPage() {
  const { user, logout } = useAuth();
  return (
    <div style={{ textAlign: 'center', marginTop: '0px' }}>
      <Navbar user={user} onLogout={logout} />
      <h1>Bienvenido al Panel de Administración</h1>
      <p>Esta es una página exclusiva para administradores.</p>
    </div>
  );
}

export default AdminPage;
