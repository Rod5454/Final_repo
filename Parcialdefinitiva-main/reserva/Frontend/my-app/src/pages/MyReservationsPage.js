import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PageTitle from '../components/PageTitle';
import ReservationsList from '../components/ReservationsList';
import { getUserReservations } from '../api/reservations';

import { useAuth } from '../context/AuthContext';

const MyReservationsPage = () => {
    const { user, logout } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            alert('Debes iniciar sesión para ver tus reservas.');
            navigate('/login');
            return;
        }

        const fetchReservations = async () => {
            try {
                const data = await getUserReservations(user.id);
                setReservations(data);
            } catch (err) {
                setError('Error al cargar tus reservas.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReservations();
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    if (loading) return <div>Cargando tus reservas...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <Navbar user={user} onLogout={logout} />
            <PageTitle title="Mis Reservas" />
            <ReservationsList reservations={reservations} />
        </div>
    );
};

export default MyReservationsPage;
