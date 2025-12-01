import { apiFetch } from '../lib/api.js';

const handleApiError = (error, defaultMessage) => {
    console.error(`[BillsAPI Error]: ${defaultMessage}`, error);

    const message = error.message || defaultMessage
    throw new Error(message);
}

export async function fetchBills(params = {}) {
    try {

        const queryParams = new URLSearchParams(params).toString()
        const url = queryParams ? `/api/bills?${queryParams}` : '/api/bills'
        const res = await apiFetch(url);


        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al obtener facturas');
        }
        const data = await res.json()

        if (data && data.facturas) {
            return data;
        } else if (Array.isArray(data)) {
            return { facturas: data, pagination: null };
        } else {
            return { facturas: [], pagination: null }
        }
    } catch (error) {
        handleApiError(error, 'Error al obtener facturas');
    }
}

export async function fetchBillById(id) {
    try {
        if (!id) {
            throw new Error('ID de factura es requerido');
        }

        const res = await apiFetch(`/api/bills/${id}`);

        if (!res.ok) {
            if (res.status === 404) {
                throw new Error('Factura no encontrada');
            }
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al obtener factura');
        }

        return await res.json();
    } catch (error) {
        handleApiError(error, `Error al obtener factura ${id}`);
    }
}

export async function deleteBill(id) {
    try {
        if (!id) {
            throw new Error('ID de factura es requerido');
        }

        const res = await apiFetch(`/api/bills/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) {
            if (res.status === 404) {
                throw new Error('Factura no encontrada');
            }
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al eliminar factura');
        }

        return await res.json();
    } catch (error) {
        handleApiError(error, `Error al eliminar factura ${id}`);
    }
}

export async function hardDeleteBill(id) {
    try {
        if (!id) {
            throw new Error('ID de factura es requerido');
        }

        const res = await apiFetch(`/api/bills/${id}/hard`, {
            method: 'DELETE'
        });

        if (!res.ok) {
            if (res.status === 404) {
                throw new Error('Factura no encontrada');
            }
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al eliminar factura permanentemente');
        }

        return await res.json();
    } catch (error) {
        handleApiError(error, `Error al eliminar permanentemente factura ${id}`);
    }
}

export async function fetchBillsStats() {
    try {
        const res = await apiFetch('/api/bills/stats');

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al obtener estadísticas');
        }

        return await res.json();
    } catch (error) {
        handleApiError(error, 'Error al obtener estadísticas');
    }
}
export async function updateBill(id, data) {
    try {
        if (!id) {
            throw new Error('ID de factura es requerido');
        }

        // Validar datos
        if (!data.num_factura && data.valor_factura === undefined) {
            throw new Error('Debe proporcionar al menos un campo para actualizar');
        }

        // Preparar payload
        const payload = {};

        if (data.num_factura !== undefined) {
            payload.num_factura = data.num_factura.trim();
        }

        if (data.valor_factura !== undefined) {
            const valor = parseFloat(data.valor_factura);
            if (isNaN(valor) || valor < 0) {
                throw new Error('El valor debe ser un número positivo');
            }
            payload.valor_factura = valor;
        }

        const res = await apiFetch(`/api/bills/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            if (res.status === 404) {
                throw new Error('Factura no encontrada');
            }
            if (res.status === 400) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Datos inválidos');
            }
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al actualizar factura');
        }

        return await res.json();
    } catch (error) {
        handleApiError(error, `Error al actualizar factura ${id}`);
    }
}

export async function searchBills(filters = {}) {
    try {
        // Limpiar filtros vacíos
        const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                acc[key] = value;
            }
            return acc;
        }, {});

        return await fetchBills(cleanFilters);
    } catch (error) {
        handleApiError(error, 'Error al buscar facturas');
    }
}