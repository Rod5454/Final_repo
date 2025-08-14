import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ClienteTable from '../components/ClienteTable';
import ClienteFormModal from '../components/ClienteFormModal';
import PageTitle from '../components/PageTitle';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { getAllUsers, updateUser, deleteUser } from '../api/users';
import '../App.css';

import { useAuth } from '../context/AuthContext';

function AdminClientesPage() {
  const { user, logout } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCliente, setCurrentCliente] = useState(null);
  
  const [formData, setFormData] = useState({
    nombres: '', apellidos: '', dni: '', email: '', telefono: ''
  });

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setClientes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleOpenModal = (cliente) => {
    setCurrentCliente(cliente);
    setFormData({
      nombres: cliente.nombres,
      apellidos: cliente.apellidos,
      dni: cliente.dni,
      email: cliente.email,
      telefono: cliente.telefono,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCliente(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(currentCliente.id, formData);
      alert('Cliente actualizado con éxito!');
      handleCloseModal();
      fetchClientes();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await deleteUser(userId);
        alert('Cliente eliminado con éxito!');
        fetchClientes();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <>
      <Navbar user={user} onLogout={logout} />
      <div className="admin-page-container">
        <PageTitle title="Panel de Clientes" />
        <ClienteTable
          clientes={clientes}
          onEditClick={handleOpenModal}
          onDeleteClick={handleDelete}
        />
      </div>

      <ClienteFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </>
  );
}

export default AdminClientesPage;
