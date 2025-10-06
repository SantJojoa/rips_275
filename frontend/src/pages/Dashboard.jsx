import { useNavigate } from 'react-router-dom';
import { getUser, isAdmin } from '../lib/auth';
import { Search, Upload } from "lucide-react";

export default function Dashboard() {
    const navigate = useNavigate();
    const user = getUser();
    const admin = isAdmin();

    return (
        <div>
            <div className="grid gap-6 sm:grid-cols-2">
                <button
                    onClick={() => navigate('/consultar')}
                    className="flex flex-col items-center justify-center gap-3 rounded-2xl border bg-white p-8 shadow-md hover:shadow-lg transition hover:-translate-y-1 cursor-pointer"
                >
                    <Search className="w-10 h-10 text-blue-var " strokeWidth={2} />
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
                        <Upload className="w-10 h-10 text-blue-var" strokeWidth={2} />
                        <h2 className="text-lg font-semibold text-slate-900 text-center">Subir JSON</h2>
                        <p className="mt-1 text-sm text-slate-600 text-center">
                            Carga archivos RIPS en formato JSON de manera rápida.
                        </p>
                    </button>
                )}
            </div>
        </div>
    );
}
