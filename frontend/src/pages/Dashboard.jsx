import { useNavigate } from 'react-router-dom';
import { getUser, isAdmin, clearToken } from '../lib/auth';
import { Search, Upload } from "lucide-react";

export default function Dashboard() {
    const navigate = useNavigate();
    const user = getUser();
    const admin = isAdmin();

    const logout = () => {
        clearToken();
        navigate('/login');
    };

    return (
        <div className="min-h-dvh bg-gradient-to-br from-slate-50 to-slate-100">
            <header className="flex items-center justify-between px-8 py-5 border-b bg-white/70 backdrop-blur-md shadow-sm">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Panel de Control</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border">
                        {user?.username} <span className="font-medium">({user?.role})</span>
                    </span>
                    <button
                        onClick={logout}
                        className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium shadow hover:bg-slate-800 transition"
                    >
                        Salir
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-5xl p-8">
                <div className="grid gap-6 sm:grid-cols-2">
                    <button
                        onClick={() => navigate('/consultar')}
                        className="flex flex-col items-center justify-center gap-3 rounded-2xl border bg-white p-8 shadow-md hover:shadow-lg transition hover:-translate-y-1 cursor-pointer"
                    >
                        <Search className="w-10 h-10 text-slate-700" />
                        <h2 className="text-lg font-semibold text-slate-900 text-center">Consultar registros</h2>
                        <p className="mt-1 text-sm text-slate-600 text-center">
                            Busca y revisa registros existentes con facilidad.
                        </p>
                    </button>

                    {admin && (
                        <button
                            onClick={() => navigate('/upload-json')}
                            className="flex flex-col items-center justify-center gap-3 rounded-2xl border bg-white p-8 shadow-md hover:shadow-lg transition hover:-translate-y-1 cursor-pointer"
                        >
                            <Upload className="w-10 h-10 text-slate-700" />
                            <h2 className="text-lg font-semibold text-slate-900 text-center">Subir JSON</h2>
                            <p className="mt-1 text-sm text-slate-600 text-center">
                                Carga archivos RIPS en formato JSON de manera rápida.
                            </p>
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}
