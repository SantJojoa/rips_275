
import { apiFetch } from "../lib/api";

export const SearchBill = async (numFactura, userId = null) => {
    if (!numFactura.trim()) {
        throw new Error("Por favor ingrese un número de factura");
    }

    const userIdParam =
        userId && typeof userId === "object"
            ? ""
            : `&user_id=${encodeURIComponent(String(userId || ""))}`;

    const url = `/api/auth/search/factura?num_factura=${encodeURIComponent(numFactura)}${userIdParam}`;
    const response = await apiFetch(url);
    const result = await response.json();

    if (!response.ok) throw new Error(result.message || "Error al buscar factura");

    return result;
};

export const consultarCUV = async (codigoUnicoValidacion) => {
    if (!codigoUnicoValidacion || !codigoUnicoValidacion.trim()) {
        throw new Error('Por favor ingrese un código CUV');
    }

    const url = '/api/auth/consultar-cuv';
    const response = await apiFetch(url, {
        method: 'POST',
        body: JSON.stringify({ codigoUnicoValidacion: codigoUnicoValidacion.trim() })
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Error al consultar el CUV');
    }

    return result;
};
