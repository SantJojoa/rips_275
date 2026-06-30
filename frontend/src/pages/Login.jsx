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
        try {
            const res = await apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Credenciales incorrectas');
                return;
            }
            setToken(data.token);
            window.location.replace('/dashboard');
        } catch (err) {
            setError(err.message || 'Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-dvh flex" style={{ backgroundColor: '#FBFBFA' }}>
            {/* Left panel - decorative */}
            <div
                className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
                style={{ backgroundColor: '#111111' }}
            >
                <div className="fade-up fade-up-1">
                    <img
                        src="logo-instituto.png"
                        alt="Logo IDSN"
                        className="h-10 w-auto object-contain brightness-0 invert opacity-90"
                    />
                </div>
                <div className="fade-up fade-up-2">
                    <p className="text-[#EAEAEA] text-3xl font-medium leading-snug tracking-tight" style={{ maxWidth: '360px' }}>
                        Gestión de registros individuales de prestación de servicios de salud.
                    </p>
                    <p className="mt-4 text-sm text-[#787774]">
                        Instituto Departamental de Salud de Nariño
                    </p>
                </div>
                <p className="text-xs text-[#444]" style={{ fontFamily: 'var(--font-mono)' }}>
                    FEV-RIPS · v2025
                </p>
            </div>

            {/* Right panel - form */}
            <div className="flex flex-1 flex-col justify-center px-8 py-12 lg:px-16">
                <div className="w-full max-w-sm mx-auto fade-up fade-up-1">
                    {/* Mobile logo */}
                    <img
                        src="logo-instituto.png"
                        alt="Logo IDSN"
                        className="lg:hidden h-10 w-auto object-contain mb-8"
                    />

                    <h1 className="text-2xl font-semibold text-[#111111] tracking-tight">
                        Iniciar sesión
                    </h1>
                    <p className="mt-2 text-sm text-[#787774]">
                        Ingresa tus credenciales para acceder al sistema.
                    </p>

                    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-[#111111] mb-1.5">
                                Usuario
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Nombre de usuario"
                                required
                                style={{
                                    border: '1px solid #EAEAEA',
                                    borderRadius: '6px',
                                    backgroundColor: '#ffffff',
                                    outline: 'none',
                                }}
                                onFocus={e => {
                                    e.target.style.borderColor = '#462882';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(70,40,130,0.08)';
                                }}
                                onBlur={e => {
                                    e.target.style.borderColor = '#EAEAEA';
                                    e.target.style.boxShadow = 'none';
                                }}
                                className="w-full px-3 py-2.5 text-sm text-[#111111] placeholder:text-[#c0bfbd] transition-all duration-150"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#111111] mb-1.5">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{
                                    border: '1px solid #EAEAEA',
                                    borderRadius: '6px',
                                    backgroundColor: '#ffffff',
                                    outline: 'none',
                                }}
                                onFocus={e => {
                                    e.target.style.borderColor = '#462882';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(70,40,130,0.08)';
                                }}
                                onBlur={e => {
                                    e.target.style.borderColor = '#EAEAEA';
                                    e.target.style.boxShadow = 'none';
                                }}
                                className="w-full px-3 py-2.5 text-sm text-[#111111] placeholder:text-[#c0bfbd] transition-all duration-150"
                            />
                        </div>

                        {error && (
                            <div style={{
                                border: '1px solid #f5c6c6',
                                borderRadius: '6px',
                                backgroundColor: '#FDEBEC',
                            }}
                                className="px-3 py-2.5 text-sm text-[#9F2F2D]">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                backgroundColor: loading ? '#787774' : '#111111',
                                borderRadius: '6px',
                                transition: 'background-color 150ms, transform 100ms',
                            }}
                            onMouseDown={e => { if (!loading) e.currentTarget.style.transform = 'scale(0.98)'; }}
                            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                            className="w-full mt-2 py-2.5 text-sm font-semibold text-white cursor-pointer disabled:cursor-not-allowed"
                        >
                            {loading ? 'Verificando...' : 'Ingresar'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
