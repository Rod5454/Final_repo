const API_BASE_URL = 'http://localhost:4000/api';

export const createReservation = async (reservationData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/reservations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservationData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al crear la reserva');
        }
        return data;
    } catch (error) {
        console.error('Error al crear reserva:', error);
        throw error;
    }
};

export const getUserReservations = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/reservations`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener las reservas del usuario');
        }
        return data;
    } catch (error) {
        console.error('Error al obtener las reservas del usuario:', error);
        throw error;
    }
};

export const getReservedHours = async (canchaId, date) => {
    try {
        const formattedDate = date.toISOString().split('T')[0];
        const response = await fetch(`${API_BASE_URL}/reservations/hours?canchaId=${canchaId}&date=${formattedDate}`);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener las horas reservadas.');
        }

        return data;
    } catch (error) {
        console.error('Error al obtener las horas reservadas:', error);
        throw error;
    }
};


export const getAllReservations = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/reservations`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener todas las reservas');
        }

        return data;
    } catch (error) {
        console.error('Error al obtener todas las reservas:', error);
        throw error;
    }
};