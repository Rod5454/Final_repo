import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection'; 
import '../App.css';

import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="home-page-container">
      <Navbar user={user} onLogout={logout} />
      <HeroSection /> 
    </div>
  );
}

export default HomePage;
