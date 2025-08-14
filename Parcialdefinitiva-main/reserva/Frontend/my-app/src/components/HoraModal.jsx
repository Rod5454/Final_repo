import React, { useState, useEffect, useCallback } from 'react';
import PaymentModal from './PaymentModal';
import { getReservedHours } from '../api/reservations';
import './HoraModal.css';

const HoraModal = ({ isOpen, onClose, onBack, cancha, selectedDate, onConfirmAndPay }) => {
    const [selectedTime, setSelectedTime] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [reservedHours, setReservedHours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const availableTimes = [
        '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
        '15:00', '16:00', '17:00', '18:00'
    ];

    useEffect(() => {
        if (isOpen && selectedDate && cancha) {
            const fetchReservedHours = async () => {
                setLoading(true);
                setError('');
                try {
                    const hours = await getReservedHours(cancha.ID, selectedDate);
                    setReservedHours(hours);
                } catch (err) {
                    setError('Error al cargar las horas reservadas.');
                    console.error('Error fetching reserved hours:', err);
                } finally {
                    setLoading(false);
                }
            };
            fetchReservedHours();
        }
    }, [isOpen, selectedDate, cancha]);

    const handleConfirmAndPay = useCallback(() => {
        if (selectedTime) {
            setShowPaymentModal(true);
        } else {
            console.log('Por favor, selecciona una hora para continuar.');
        }
    }, [selectedTime]);

    const handlePaymentConfirmed = (paymentDetails) => {
        console.log("Pago confirmado:", paymentDetails);
        onConfirmAndPay(cancha.ID, selectedDate, selectedTime);
        setShowPaymentModal(false);
    };

    const handleBackFromPayment = useCallback(() => {
        setShowPaymentModal(false);
    }, []);

    const isReserved = useCallback((time) => {
        return reservedHours.includes(time);
    }, [reservedHours]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3>Seleccionar Hora</h3>
                <p>
                    Reservando {cancha.NOMBRE} para el día: **{selectedDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}**
                </p>

                {loading ? (
                    <div className="loading-message">Cargando horas disponibles...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <div className="time-slots-container">
                        {availableTimes.map(time => {
                            const isHourReserved = isReserved(time);
                            return (
                                <button
                                    key={time}
                                    className={`time-slot-btn ${selectedTime === time ? 'selected' : ''} ${isHourReserved ? 'reserved' : ''}`}
                                    onClick={() => !isHourReserved && setSelectedTime(time)}
                                    disabled={isHourReserved}
                                >
                                    {time}
                                </button>
                            );
                        })}
                    </div>
                )}

                {selectedTime && (
                    <p className="selected-date-info">Hora seleccionada: **{selectedTime}**</p>
                )}

                <div className="modal-actions">
                    <button
                        onClick={handleConfirmAndPay}
                        className="btn-primary"
                        disabled={!selectedTime}
                    >
                        Confirmar hora y pagar
                    </button>
                    <button onClick={onBack} className="btn-secondary">
                        Atrás
                    </button>
                </div>
            </div>

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={handleBackFromPayment}
                onBack={handleBackFromPayment}
                cancha={cancha}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onPaymentConfirmed={handlePaymentConfirmed}
            />
        </div>
    );
};

export default HoraModal;
