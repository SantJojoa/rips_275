
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
