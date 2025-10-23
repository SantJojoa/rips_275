const API_URL = 'http://localhost:3000/api/bills'; // Ajusta el puerto si es necesario

export async function fetchBills() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Error al obtener facturas');
        return await res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function deleteBill(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Error al eliminar factura');
        return await res.json();
    } catch (error) {
        console.error(error);
    }
}
export async function updateBill(id, data) {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                num_factura: data.num_factura,   // <-- coincide con backend
                valor_factura: parseFloat(data.valor_factura)
            })
        });
        if (!res.ok) throw new Error('Error al actualizar factura');
        return await res.json();
    } catch (error) {
        console.error(error);
    }
}
