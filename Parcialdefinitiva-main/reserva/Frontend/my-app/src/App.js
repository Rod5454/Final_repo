import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css'; 

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CatalogPage from './pages/CatalogPage';
import MyReservationsPage from './pages/MyReservationsPage'; 
import AdminPage from './pages/AdminPage'; 
import AdminClientesPage from './pages/AdminClientesPage';
import AdminReservasPage from './pages/AdminReservasPage';
import AdminCanchasPage from './pages/AdminCanchasPage';

import { AuthProvider } from './context/AuthContext';


function App() {
    return (
        <Router>

            <AuthProvider>
                <div className="App">
                    <Routes>

                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/catalog" element={<CatalogPage />} />
                        <Route path="/my-reservations" element={<MyReservationsPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/admin/clientes" element={<AdminClientesPage />} />
                        <Route path="/admin/reservas" element={<AdminReservasPage />} />
                        <Route path="/admin/canchas" element={<AdminCanchasPage />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
