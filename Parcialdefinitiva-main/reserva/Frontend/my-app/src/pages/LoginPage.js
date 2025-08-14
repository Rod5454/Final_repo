import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import LoginForm from '../components/LoginForm'; 
import '../App.css'; 

import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate(); 
  const { login } = useAuth();

  return (
    <div className="login-page-container">
      <LoginForm onLogin={login} navigate={navigate} />
    </div>
  );
}

export default LoginPage;
