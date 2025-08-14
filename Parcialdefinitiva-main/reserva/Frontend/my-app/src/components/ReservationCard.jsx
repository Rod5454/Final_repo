import React from 'react';

const ReservationCard = ({ reserva }) => {
    return (
        <div className="reservation-row">
            <div className="table-cell">{reserva.CANCHANOMBRE}</div>
            <div className="table-cell">{new Date(reserva.RESERVATION_DATE).toLocaleDateString()}</div>
            <div className="table-cell">{reserva.RESERVATION_TIME}</div>
            <div className="table-cell">{reserva.STATUS || 'Confirmado'}</div>
        </div>
    );
};

export default ReservationCard;
