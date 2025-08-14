    import React from 'react';
    import ReservationCard from './ReservationCard';
    import './Reservations.css';

    const ReservationsList = ({ reservations }) => {
        if (reservations.length === 0) {
            return <p className="no-reservations-message">No tienes reservas activas.</p>;
        }

        return (
            <div className="reservations-table-container">
                <div className="table-header">
                    <div className="table-cell">Cancha</div>
                    <div className="table-cell">Fecha</div>
                    <div className="table-cell">Hora</div>
                    <div className="table-cell">Estado</div>
                </div>
                
                {reservations.map(reserva => (
                    <ReservationCard key={reserva.ID} reserva={reserva} />
                ))}
            </div>
        );
    };

    export default ReservationsList;
