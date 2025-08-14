import React, { useState, useCallback, useMemo } from 'react';
import HoraModal from './HoraModal';
import './ReservationModal.css';

const ReservationModal = React.memo(({ isOpen, onClose, cancha, onConfirmAndPay }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showHoraModal, setShowHoraModal] = useState(false);

  const daysInMonth = useMemo(() => {
    const date = new Date(currentYear, currentMonth, 1);
    const days = [];
    const firstDayOfWeek = (date.getDay() === 0 ? 6 : date.getDay() - 1);
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    while (date.getMonth() === currentMonth) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentMonth, currentYear]);

  const handleDayClick = useCallback((date) => {
    if (date && date >= new Date().setHours(0,0,0,0)) {
      setSelectedDate(date);
    }
  }, []);

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth(prevMonth => {
      if (prevMonth === 0) {
        setCurrentYear(prevYear => prevYear - 1);
        return 11;
      }
      return prevMonth - 1;
    });
    setSelectedDate(null);
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(prevMonth => {
      if (prevMonth === 11) {
        setCurrentYear(prevYear => prevYear + 1);
        return 0;
      }
      return prevMonth + 1;
    });
    setSelectedDate(null);
  }, []);

  const handleConfirmDate = useCallback(() => {
    if (selectedDate) {
      setShowHoraModal(true);
    } else {
    }
  }, [selectedDate]);

  if (!isOpen) {
    return null; 
  }

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>Reservar Cancha: {cancha.NOMBRE}</h3>
        <p>Precio: S/ {cancha.PRECIO_GENERAL} | Jugadores: {cancha.JUGADORES}</p>
        <div className="calendar-container">
          <div className="calendar-header">
            <button onClick={handlePrevMonth}>&lt;</button>
            <span>{monthNames[currentMonth]} {currentYear}</span>
            <button onClick={handleNextMonth}>&gt;</button>
          </div>
          <div className="calendar-grid">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
              <div
                key={day}
                className="calendar-day-name"
              >
                {day}
              </div>
            ))}
            {daysInMonth.map((day, index) => (
              <div
                key={index}
                className={`calendar-day ${day ? '' : 'empty'} ${day && day.toDateString() === selectedDate?.toDateString() ? 'selected' : ''} ${day && day < new Date().setHours(0,0,0,0) ? 'past' : ''}`}
                onClick={() => handleDayClick(day)}
              >
                {day ? day.getDate() : ''}
              </div>
            ))}
          </div>
        </div>
        {selectedDate && (
          <p className="selected-date-info">Fecha seleccionada: **{selectedDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}**</p>
        )}
        <div className="modal-actions">
          <button onClick={handleConfirmDate} className="btn-primary" disabled={!selectedDate}>Confirmar Fecha</button>
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
        </div>
      </div>

      <HoraModal
        isOpen={showHoraModal}
        onClose={onClose}
        onBack={() => setShowHoraModal(false)}
        cancha={cancha}
        selectedDate={selectedDate}
        onConfirmAndPay={onConfirmAndPay}
      />
    </div>
  );
});

export default ReservationModal;
