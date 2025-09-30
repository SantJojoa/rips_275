import { useState } from 'react';
import { apiFetch } from '../lib/api';

export default function UploadJson() {
    const [prestadorId, setPrestadorId] = useState('');
    const [jsonText, setJsonText] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    const [err, setErr] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null); setErr(null);
        let dataObj = null;
        try {
            dataObj = JSON.parse(jsonText);
        } catch {
            setErr('El JSON no es válido');
            return;
        }
        setLoading(true);
        try {
            const res = await apiFetch('/api/auth/upload-json', {
                method: 'POST',
                body: JSON.stringify({
                    prestadorId: Number(prestadorId),
                    data: dataObj,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setErr(data?.message || 'Error en la carga');
                return;
            }
            setMsg(data?.message || 'Carga realizada correctamente');
        } catch {
            setErr('No se pudo conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    const handleFile = async (file) => {
        const text = await file.text();
        setJsonText(text);
    };

    return (
        <div className="min-h-dvh bg-slate-50 p-6">
            <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow ring-1 ring-slate-200">
                <h1 className="text-xl font-semibold text-slate-900">Subir JSON</h1>
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">ID Prestador</label>
                        <input
                            type="number"
                            value={prestadorId}
                            onChange={(e) => setPrestadorId(e.target.value)}
                            required
                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-slate-700">JSON</label>
                            <input
                                type="file"
                                accept="application/json,.json"
                                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                                className="text-sm"
                            />
                        </div>
                        <textarea
                            rows={12}
                            value={jsonText}
                            onChange={(e) => setJsonText(e.target.value)}
                            placeholder='{"numDocumentoIdObligado": "...", "numFactura": "..."}'
                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                        />
                    </div>

                    {err && <div className="rounded-md bg-red-50 p-2 text-sm text-red-700 ring-1 ring-red-200">{err}</div>}
                    {msg && <div className="rounded-md bg-emerald-50 p-2 text-sm text-emerald-700 ring-1 ring-emerald-200">{msg}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-sky-600 px-4 py-2.5 text-white font-medium shadow hover:bg-sky-700 disabled:opacity-60"
                    >
                        {loading ? 'Cargando...' : 'Subir'}
                    </button>
                </form>
            </div>
        </div>
    );
}