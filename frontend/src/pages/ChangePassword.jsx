import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { apiFetch } from '../lib/api';
import { setToken, clearToken, getUser, mustChangePassword } from '../lib/auth';
import { showSuccess } from '../utils/toastUtils';

const inputStyle = {
    border: '1px solid #EAEAEA',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    outline: 'none',
};

export default function ChangePassword() {
    const navigate = useNavigate();
    const forced = mustChangePassword();
    const user = getUser();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const onFocus = e => {
        e.target.style.borderColor = '#462882';
        e.target.style.boxShadow = '0 0 0 3px rgba(70,40,130,0.08)';
    };
    const onBlur = e => {
        e.target.style.borderColor = '#EAEAEA';
        e.target.style.boxShadow = 'none';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (newPassword.length < 6) return setError('La nueva contraseña debe tener al menos 6 caracteres');
        if (newPassword !== confirmPassword) return setError('Las contraseñas no coinciden');
        if (newPassword === currentPassword) return setError('La nueva contraseña debe ser diferente a la actual');

        setLoading(true);
        try {
            const res = await apiFetch('/api/auth/change-password', {
                method: 'PUT',
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data?.message || 'Error al cambiar la contraseña');
                return;
            }
            setToken(data.token);
            showSuccess('Contraseña actualizada correctamente');
            window.location.replace('/dashboard');
        } catch (err) {
            setError(err.message || 'Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        clearToken();
        navigate('/login', { replace: true });
    };

    return (
        <div className="min-h-dvh flex items-center justify-center px-6" style={{ backgroundColor: '#FBFBFA' }}>
            <div className="w-full max-w-sm fade-up fade-up-1">
                <div style={{ border: '1px solid #EAEAEA', borderRadius: '10px', backgroundColor: '#ffffff' }} className="p-8">
                    <h1 className="text-xl font-semibold text-[#111111] tracking-tight">
                        {forced ? 'Debes cambiar tu contraseña' : 'Cambiar contraseña'}
                    </h1>
                    <p className="mt-2 text-sm text-[#787774]">
                        {forced
                            ? `Hola ${user?.username}, por seguridad debes establecer una nueva contraseña antes de continuar.`
                            : 'Actualiza tu contraseña de acceso.'}
                    </p>

                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-[#111111] mb-1.5">Contraseña actual</label>
                            <div className="relative">
                                <input
                                    type={showCurrent ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={e => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                    style={inputStyle}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    className="w-full px-3 py-2.5 pr-10 text-sm text-[#111111] placeholder:text-[#c0bfbd] transition-all duration-150"
                                />
                                <button type="button" onClick={() => setShowCurrent(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#787774] hover:text-[#111111] transition-colors" tabIndex={-1}>
                                    {showCurrent ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#111111] mb-1.5">Nueva contraseña</label>
                            <div className="relative">
                                <input
                                    type={showNew ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    autoComplete="new-password"
                                    style={inputStyle}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    className="w-full px-3 py-2.5 pr-10 text-sm text-[#111111] placeholder:text-[#c0bfbd] transition-all duration-150"
                                />
                                <button type="button" onClick={() => setShowNew(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#787774] hover:text-[#111111] transition-colors" tabIndex={-1}>
                                    {showNew ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#111111] mb-1.5">Confirmar nueva contraseña</label>
                            <input
                                type={showNew ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                autoComplete="new-password"
                                style={inputStyle}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                className="w-full px-3 py-2.5 text-sm text-[#111111] placeholder:text-[#c0bfbd] transition-all duration-150"
                            />
                        </div>

                        {error && (
                            <div style={{ border: '1px solid #f5c6c6', borderRadius: '6px', backgroundColor: '#FDEBEC' }}
                                className="px-3 py-2.5 text-sm text-[#9F2F2D]">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit" disabled={loading}
                            style={{
                                backgroundColor: loading ? '#787774' : '#111111',
                                borderRadius: '6px',
                                transition: 'background-color 150ms, transform 100ms',
                            }}
                            onMouseDown={e => { if (!loading) e.currentTarget.style.transform = 'scale(0.98)'; }}
                            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                            className="w-full mt-2 py-2.5 text-sm font-semibold text-white cursor-pointer disabled:cursor-not-allowed"
                        >
                            {loading ? 'Guardando...' : 'Guardar y continuar'}
                        </button>

                        {!forced && (
                            <button type="button" onClick={() => navigate('/dashboard')}
                                className="w-full text-sm text-[#787774] hover:text-[#111111] cursor-pointer">
                                Cancelar
                            </button>
                        )}
                    </form>

                    <button onClick={handleLogout} className="mt-6 text-xs text-[#787774] hover:text-[#111111] underline cursor-pointer">
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    );
}
