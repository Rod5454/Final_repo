const API_BASE_URL = 'http://localhost:4000/api';

export const getCanchas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/canchas`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener las canchas');
    }

    return data;
  } catch (error) {
    console.error('Error al obtener canchas:', error);
    throw error;
  }
};

export const createCancha = async (canchaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/canchas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(canchaData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al crear la cancha.');
    }
    return data;
  } catch (error) {
    console.error('Error al crear la cancha:', error);
    throw error;
  }
};

export const updateCancha = async (canchaId, updatedData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/canchas/${canchaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar la cancha.');
    }
    return data;
  } catch (error) {
    console.error('Error al actualizar la cancha:', error);
    throw error;
  }
};

export const deleteCancha = async (canchaId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/canchas/${canchaId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al eliminar la cancha.');
    }
    return { message: 'Cancha eliminada exitosamente.' };
  } catch (error) {
    console.error('Error al eliminar la cancha:', error);
    throw error;
  }
};