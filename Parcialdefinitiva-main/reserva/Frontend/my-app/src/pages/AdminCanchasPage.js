import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CanchaTable from '../components/CanchaTable';
import CanchaFormModal from '../components/CanchaFormModal';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import AddCanchaButton from '../components/AddCanchaButton';
import AdminPageLayout from '../components/AdminPageLayout';
import { getCanchas, createCancha, updateCancha, deleteCancha } from '../api/canchas';
import '../App.css';

import { useAuth } from '../context/AuthContext';

function AdminCanchasPage() {
  const { user, logout } = useAuth();
  const [canchas, setCanchas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCancha, setCurrentCancha] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '', imagen: '', descripcion: '',
    precio_general: '', jugadores: '', duracion: ''
  });

  const fetchCanchas = async () => {
    try {
      setLoading(true);
      const data = await getCanchas();
      setCanchas(data);
    } catch (err) {
      setError('Error al obtener las canchas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCanchas();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (cancha = null) => {
    setCurrentCancha(cancha);
    if (cancha) {
      setFormData({
        nombre: cancha.NOMBRE, imagen: cancha.IMAGEN, descripcion: cancha.DESCRIPCION,
        precio_general: cancha.PRECIO_GENERAL, jugadores: cancha.JUGADORES, duracion: cancha.DURACION
      });
    } else {
      setFormData({
        nombre: '', imagen: '', descripcion: '',
        precio_general: '', jugadores: '', duracion: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCancha(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentCancha) {
        await updateCancha(currentCancha.ID, formData);
        alert('Cancha actualizada con éxito!');
      } else {
        await createCancha(formData);
        alert('Cancha creada con éxito!');
      }
      handleCloseModal();
      fetchCanchas();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (canchaId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta cancha?')) {
      try {
        await deleteCancha(canchaId);
        alert('Cancha eliminada con éxito!');
        fetchCanchas();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <>
      <Navbar user={user} onLogout={logout} />
      <AdminPageLayout title="Administrar Canchas">
        <AddCanchaButton onClick={() => handleOpenModal()} />
        
        {loading && <LoadingState />}
        {error && <ErrorState message={error} />}
        
        {!loading && !error && (
          <CanchaTable
            canchas={canchas}
            onEditClick={handleOpenModal}
            onDeleteClick={handleDelete}
          />
        )}
      </AdminPageLayout>

      <CanchaFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        currentCancha={currentCancha}
      />
    </>
  );
}

export default AdminCanchasPage;
