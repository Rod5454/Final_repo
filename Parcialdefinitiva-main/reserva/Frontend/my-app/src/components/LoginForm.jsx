import React, { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom'; 
import { loginUser } from '../api/auth'; 
import { useAuth } from '../context/AuthContext'; 


function LoginForm() {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState('');
  

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    setError(''); 

    try {
      const data = await loginUser(email, password); 
      login(data.user); 
      
      
      if (data.user.is_admin === 1) {
        navigate('/admin'); 
      } else {
        navigate('/catalog'); 
      }
      
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Inténtalo de nuevo.'); 
      console.error('Error de login:', err); 
    }
  };

  return (
    <div className="login-box">
      <img src="/images.png" alt="Arena 7 Logo" className="login-logo" /> 
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="btn-primary">Iniciar sesión</button>
      </form>
      <Link to="/forgot-password" className="forgot-password-link">¿Has olvidado la contraseña?</Link>
    </div>
  );
}

export default LoginForm;
