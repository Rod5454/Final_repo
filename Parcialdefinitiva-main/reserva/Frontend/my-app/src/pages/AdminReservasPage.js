import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ReservaTable from '../components/ReservaTable';
import { getAllReservations } from '../api/reservations';
import '../App.css';

import { useAuth } from '../context/AuthContext';

function AdminReservasPage() {
  const { user, logout } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getAllReservations();
        setReservations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  if (loading) return <p>Cargando reservas...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <>
      <Navbar user={user} onLogout={logout} />
      <div className="admin-page-container">
        <h1 className="admin-title">Panel de Reservas de Clientes</h1>
        <ReservaTable reservations={reservations} />
      </div>
    </>
  );
}

export default AdminReservasPage;
