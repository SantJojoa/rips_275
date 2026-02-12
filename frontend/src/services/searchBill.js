
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


    if (!response.ok && !result.ResultadosValidacion && result.ResultState === undefined) {
        throw new Error(result.message || 'Error al consultar el CUV');
    }

    return result;
};


export const compareCuvXml = async (cuvFile, xmlFile, cuvText = '') => {
    if ((!cuvFile && !cuvText.trim()) || !xmlFile) {
        throw new Error('Se requieren el código CUV (archivo o texto) y el archivo XML');
    }

    const formData = new FormData();

    if (cuvFile) {
        formData.append('cuv', cuvFile);
    }
    if (cuvText.trim()) {
        formData.append('cuvText', cuvText.trim());
    }

    formData.append('xml', xmlFile);

    const url = '/api/auth/compare-cuv-xml';
    const response = await apiFetch(url, {
        method: 'POST',
        body: formData,
        headers: {}
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Error al comparar CUV y XML');
    }

    return result;
};


