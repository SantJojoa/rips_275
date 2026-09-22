import { apiFetch } from '../lib/api.js';

const handleApiError = (error, defaultMessage) => {
    console.error(`[UsersAPI Error]: ${defaultMessage}`, error);

    const message = error.message || defaultMessage;
    throw new Error(message);
};

export async function fetchUsers() {
    try {
        const res = await apiFetch('/api/users');

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al obtener usuarios');
        }

        return await res.json();
    } catch (error) {
        handleApiError(error, 'Error al obtener usuarios');
    }
}

export async function updateUser(id, data) {
    try {
        if (!id) {
            throw new Error('ID de usuario es requerido');
        }

        const res = await apiFetch(`/api/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al actualizar usuario');
        }

        return await res.json();
    } catch (error) {
        handleApiError(error, `Error al actualizar usuario ${id}`);
    }
}

export async function deleteUser(id) {
    try {
        if (!id) {
            throw new Error('ID de usuario es requerido');
        }

        const res = await apiFetch(`/api/users/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al eliminar usuario');
        }

        return await res.json();
    } catch (error) {
        handleApiError(error, `Error al eliminar usuario ${id}`);
    }
}
