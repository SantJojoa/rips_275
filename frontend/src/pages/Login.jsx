import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import { setToken } from '../lib/auth';

const EyeIcon = ({ open }) => open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
);

const REMEMBER_KEY = 'rips_remember_username';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(REMEMBER_KEY);
        if (saved) {
            setUsername(saved);
            setRemember(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
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
            if (remember) {
                localStorage.setItem(REMEMBER_KEY, username);
            } else {
                localStorage.removeItem(REMEMBER_KEY);
            }
            setToken(data.token);
            window.location.replace('/dashboard');
        } catch (err) {
            setError(err.message || 'Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        border: '1px solid #EAEAEA',
        borderRadius: '6px',
        backgroundColor: '#ffffff',
        outline: 'none',
    };
    const onFocus = e => {
        e.target.style.borderColor = '#462882';
        e.target.style.boxShadow = '0 0 0 3px rgba(70,40,130,0.08)';
    };
    const onBlur = e => {
        e.target.style.borderColor = '#EAEAEA';
        e.target.style.boxShadow = 'none';
    };

    return (
        <div className="min-h-dvh flex" style={{ backgroundColor: '#FBFBFA' }}>
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12" style={{ backgroundColor: '#111111' }}>
                <div className="fade-up fade-up-1">
                    <img src="logo-instituto.png" alt="Logo IDSN" className="h-10 w-auto object-contain brightness-0 invert opacity-90" />
                </div>
                <div className="fade-up fade-up-2">
                    <p className="text-[#EAEAEA] text-3xl font-medium leading-snug tracking-tight" style={{ maxWidth: '360px' }}>
                        Gestión de registros individuales de prestación de servicios de salud.
                    </p>
                    <p className="mt-4 text-sm text-[#787774]">Instituto Departamental de Salud de Nariño</p>
                </div>
                <p className="text-xs text-[#444]" style={{ fontFamily: 'var(--font-mono)' }}>FEV-RIPS · v1.0</p>
            </div>

            {/* Right panel */}
            <div className="flex flex-1 flex-col justify-center px-8 py-12 lg:px-16">
                <div className="w-full max-w-sm mx-auto fade-up fade-up-1">
                    <img src="logo-instituto.png" alt="Logo IDSN" className="lg:hidden h-10 w-auto object-contain mb-8" />

                    <h1 className="text-2xl font-semibold text-[#111111] tracking-tight">Iniciar sesión</h1>
                    <p className="mt-2 text-sm text-[#787774]">Ingresa tus credenciales para acceder al sistema.</p>

                    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-[#111111] mb-1.5">Usuario</label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Nombre de usuario"
                                required
                                autoComplete="username"
                                style={inputStyle}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                className="w-full px-3 py-2.5 text-sm text-[#111111] placeholder:text-[#c0bfbd] transition-all duration-150"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#111111] mb-1.5">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                    style={inputStyle}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    className="w-full px-3 py-2.5 pr-10 text-sm text-[#111111] placeholder:text-[#c0bfbd] transition-all duration-150"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#787774] hover:text-[#111111] transition-colors"
                                    tabIndex={-1}
                                >
                                    <EyeIcon open={showPassword} />
                                </button>
                            </div>
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={e => setRemember(e.target.checked)}
                                className="w-4 h-4 rounded accent-[#462882] cursor-pointer"
                            />
                            <span className="text-sm text-[#787774]">Recordar usuario</span>
                        </label>

                        {error && (
                            <div style={{ border: '1px solid #f5c6c6', borderRadius: '6px', backgroundColor: '#FDEBEC' }}
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
