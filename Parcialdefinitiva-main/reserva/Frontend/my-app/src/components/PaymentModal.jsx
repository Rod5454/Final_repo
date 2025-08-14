
import React, { useState } from 'react';
import CardPayment from './CardPayment';
import QrPayment from './QrPayment';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, onBack, cancha, selectedDate, selectedTime, onPaymentConfirmed }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  if (!isOpen) {
    return null;
  }

  const handlePaymentCompleted = (details) => {
    onPaymentConfirmed(details);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="payment-header">
          <h3>Selecciona tu método de pago</h3>
          <p className="payment-summary">
            **Cancha:** {cancha.NOMBRE} <br />
            **Fecha:** {selectedDate.toLocaleDateString('es-ES')} <br />
            **Hora:** {selectedTime} <br />
            **Monto total:** S/ {cancha.PRECIO_GENERAL }
          </p>
        </div>
        
        <div className="payment-method-tabs">
          <div
            className={`tab ${paymentMethod === 'card' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('card')}
          >
             Tarjeta
          </div>
          <div
            className={`tab ${paymentMethod === 'qr' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('qr')}
          >
             QR
          </div>
        </div>

        <div className="payment-content">
          {paymentMethod === 'card' ? (
            <CardPayment cancha={cancha} onPaymentCompleted={handlePaymentCompleted} />
          ) : (
            <QrPayment cancha={cancha} onPaymentCompleted={handlePaymentCompleted} />
          )}
        </div>
        
        <div className="modal-actions">
          <button onClick={onBack} className="btn-secondary">Atrás</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
