
const API_BASE_URL = 'http://localhost:4000/api';

export const getAllUsers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener los clientes');
        }

        return data;
    } catch (error) {
        console.error('Error al obtener todos los usuarios:', error);
        throw error;
    }
};


export const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar el usuario.');
    }
    return data;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al eliminar el usuario.');
    }
    return { message: 'Usuario eliminado exitosamente.' };
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
};