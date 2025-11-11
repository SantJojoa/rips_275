import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { setToken } from '../lib/auth';


export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        //TODO : CAMBIAR LA RUTA
        try {
            const res = await apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Error al iniciar sesión');
                return;
            }
            setToken(data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-dvh flex items-center justify-center bg-gradient-to-br from-sky-50 via-slate-100 to-slate-200 p-6'>
            <div className='w-full max-w-sm rounded-2xl bg-white/80 backdrop-blur-md shadow-xl border border-slate-200'>
                <div className='p-8'>
                    <img
                        src="logo-instituto.png"
                        alt="Logo IDSN"
                        className="mx-auto mb-6 h-30 w-auto object-contain drop-shadow-md"
                    />
                    <h1 className='text-3xl font-bold text-slate-900 tracking-tight'>Bienvenido</h1>
                    <h2 className='text-xl font-semibold text-green-var  tracking-wide mb-5'>Sistema RIPS</h2>
                    <p className='mt-2 text-sm text-slate-600'>Ingresa tus credenciales para continuar</p>

                    <form className='mt-3 space-y-5' onSubmit={handleSubmit}>
                        <div>
                            <label className='block text-sm font-medium text-slate-700'>Usuario</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder='Ingrese su usuario'
                                required
                                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-400/40 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-400/40 transition"
                            />
                        </div>
                        {error && (
                            <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700 border border-red-200 shadow-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full rounded-xl bg-blue-var px-4 py-3 text-white font-semibold shadow-lg hover:bg-blue-light-var focus:outline-none focus:ring-2 focus:ring-sky-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer'
                        >
                            {loading ? 'Ingresando...' : 'Ingresar'}
                        </button>
                    </form>

                </div>

            </div>
        </div>
    )
}
