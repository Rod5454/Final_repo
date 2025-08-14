
import React, { useState } from 'react';
import './CardPayment.css';

const CardPayment = ({ cancha, onPaymentCompleted }) => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '', 
    expiryDate: '',
    cvv: '',
    name: '',
    lastName: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Procesando pago con tarjeta...", cardDetails);
    onPaymentCompleted({ method: 'card', details: cardDetails });
  };

  return (
    <form className="card-payment-form" onSubmit={handleSubmit}>
      <p className="info-text">Recuerda activar tus compras por internet</p>
      
      <div className="input-group">
        <label htmlFor="cardNumber">Número de tarjeta</label>
        <div className="card-number-input-container">
            <input
            id="cardNumber"
            name="cardNumber"
            type="text"
            value={cardDetails.cardNumber}
            onChange={handleChange}
            placeholder="Número de tarjeta"
            required
            />
            <div className="card-logos">
                                                                            </div>
        </div>
      </div>

      <div className="input-group-row">
        <div className="input-group">
          <label htmlFor="expiryDate">Caducidad</label>
          <input
            id="expiryDate"
            name="expiryDate"
            type="text"
            value={cardDetails.expiryDate}
            onChange={handleChange}
            placeholder="MM/AA"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="cvv">CVV</label>
          <input
            id="cvv"
            name="cvv"
            type="text"
            value={cardDetails.cvv}
            onChange={handleChange}
            placeholder="CVV"
            required
          />
        </div>
      </div>
      
      <div className="input-group-row">
        <div className="input-group">
          <label htmlFor="name">Nombres</label>
          <input
            id="name"
            name="name"
            type="text"
            value={cardDetails.name}
            onChange={handleChange}
            placeholder="Nombres"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="lastName">Apellidos</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={cardDetails.lastName}
            onChange={handleChange}
            placeholder="Apellidos"
            required
          />
        </div>
      </div>
      
      <div className="input-group">
        <label htmlFor="email">Correo</label>
        <input
          id="email"
          name="email"
          type="email"
          value={cardDetails.email}
          onChange={handleChange}
          placeholder="Correo"
          required
        />
      </div>

      <button type="submit" className="btn-pay">Pagar S/{cancha.PRECIO_GENERAL}</button>
    </form>
  );
};  

export default CardPayment;
