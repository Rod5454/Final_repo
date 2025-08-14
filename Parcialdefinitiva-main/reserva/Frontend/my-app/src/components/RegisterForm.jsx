
import React, { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { registerUser } from '../api/auth'; 


function RegisterForm({ navigate }) {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    dni: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const data = await registerUser(formData);
      setSuccessMessage(data.message);

      setTimeout(() => {
        navigate('/login'); 
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al registrar usuario. Inténtalo de nuevo.');
      console.error('Error de registro:', err);
    }
  };

  return (
    <div className="register-box">
      <img src="/images.png" alt="Arena 7 Logo" className="register-logo" /> 
      <h2>Registro de nuevo usuario</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          key !== 'confirmPassword' && (
            <div className="input-group" key={key}>
              <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</label>
              <input
                type={key.includes('password') ? 'password' : key.includes('email') ? 'email' : 'text'}
                id={key}
                value={formData[key]}
                onChange={handleChange}
                required
              />
            </div>
          )
        ))}
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirmar contraseña:</label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <div className="form-actions">
          <button type="submit" className="btn-primary">Registrar</button>
          <Link to="/" className="btn-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;