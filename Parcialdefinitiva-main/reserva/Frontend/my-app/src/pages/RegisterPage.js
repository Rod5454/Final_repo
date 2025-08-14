
import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import RegisterForm from '../components/RegisterForm'; 
import '../App.css'; 

function RegisterPage() {
  const navigate = useNavigate(); 
  return (
    <div className="register-page-container">
      <RegisterForm navigate={navigate} />
    </div>
  );
}

export default RegisterPage;