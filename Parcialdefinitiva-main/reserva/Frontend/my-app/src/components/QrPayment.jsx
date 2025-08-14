
import React, { useState, useEffect } from 'react';
import './QrPayment.css';

const QrPayment = ({ cancha, onPaymentCompleted }) => {
  const [qrGenerated, setQrGenerated] = useState(false);
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    const placeholderQr = 'https://placehold.co/200x200';
    setQrCode(placeholderQr);
    setQrGenerated(true);

    const paymentTimeout = setTimeout(() => {
      console.log("Simulación: Pago por QR detectado.");
      onPaymentCompleted({ method: 'qr' });
    }, 5000); 

    return () => clearTimeout(paymentTimeout);
  }, [onPaymentCompleted]);

  return (
    <div className="qr-payment-container">
      <p className="info-text">Escanea el QR desde tu billetera favorita para finalizar con el pago.</p>
      
      <div className="amount-box">
        <span className="amount-label">Monto total:</span>
        <span className="amount-value">S/ {cancha.PRECIO_GENERAL}</span>
      </div>
      
      {qrGenerated ? (
        <img src={qrCode} alt="Código QR para pago" className="qr-code-image" />
      ) : (
        <div className="loading-qr">Generando código QR...</div>
      )}
      
      <div className="wallet-logos">
                                                      </div>
    </div>
  );
};

export default QrPayment;
