
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CanchaList from '../components/CanchaList';
import PageTitle from '../components/PageTitle';
import ReservationModal from '../components/ReservationModal';
import { getCanchas } from '../api/canchas';
import { createReservation } from '../api/reservations';
import '../App.css';

import { useAuth } from '../context/AuthContext';

function CatalogPage() {
  const { user, logout } = useAuth();
  const [canchas, setCanchas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedCanchaForReservation, setSelectedCanchaForReservation] = useState(null);

  useEffect(() => {
    const fetchCanchas = async () => {
      try {
        const data = await getCanchas();
        setCanchas(data);
      } catch (err) {
        setError(err.message || 'Error al cargar las canchas.');
        console.error('Error fetching canchas:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCanchas();
  }, []);

  const handleReservarClick = useCallback((cancha) => {
    if (user) {
      setSelectedCanchaForReservation(cancha);
      setShowReservationModal(true);
    } else {
      alert('Debes iniciar sesión para reservar una cancha.');
      navigate('/login');
    }
  }, [user, navigate]);

  const handleCloseReservationModal = useCallback(() => {
    setShowReservationModal(false);
    setSelectedCanchaForReservation(null);
  }, []);

  const handleConfirmAndPayReservation = useCallback(async (canchaId, selectedDate, selectedTime) => {
    if (!user) {
      alert('Debes iniciar sesión para completar la reserva.');
      navigate('/login');
      return;
    }

    const reservationData = {
      userId: user.id,
      canchaId: canchaId,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
    };

    try {
      await createReservation(reservationData);
      alert('Reserva creada exitosamente.');
    } catch (error) {
      console.error('Error al confirmar y pagar la reserva:', error);
      alert(`Hubo un error al crear la reserva: ${error.message}`);
    } finally {
      handleCloseReservationModal();
    }
  }, [user, navigate, handleCloseReservationModal]);

  if (loading) return <div className="loading-message">Cargando canchas...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="catalog-page-container">
      <Navbar user={user} onLogout={logout} />
      <PageTitle title="Canchas Disponibles" />
      <CanchaList canchas={canchas} onReservarClick={handleReservarClick} />
      
      {showReservationModal && selectedCanchaForReservation && (
        <ReservationModal
          isOpen={showReservationModal}
          onClose={handleCloseReservationModal}
          cancha={selectedCanchaForReservation}
          onConfirmAndPay={handleConfirmAndPayReservation}
        />
      )}
    </div>
  );
}

export default CatalogPage;
