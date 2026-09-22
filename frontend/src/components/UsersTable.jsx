import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Pencil, Trash2, Loader2, RefreshCw, Eye, EyeOff } from 'lucide-react';
import Select from 'react-select';
import { apiFetch } from '../lib/api';
import { fetchUsers, updateUser, deleteUser } from '../api/usersApi';
import { getUser } from '../lib/auth';
import { showError, showSuccess } from '../utils/toastUtils';

const ROLE_LABELS = { SUPERADMIN: 'Superadmin', ADMIN: 'Administrador', USER: 'Prestador' };
const ROLE_COLORS = {
    SUPERADMIN: { bg: '#F3EEFE', color: '#7C3AED' },
    ADMIN: { bg: '#E1F3FE', color: '#1F6C9F' },
    USER: { bg: '#F0F0EF', color: '#787774' },
};

const inputStyle = {
    border: '1px solid #EAEAEA',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    outline: 'none',
    width: '100%',
    padding: '8px 12px',
    fontSize: '14px',
    color: '#111111',
    transition: 'border-color 150ms, box-shadow 150ms',
    boxSizing: 'border-box',
};

const SELECT_STYLES = {
    control: (b, s) => ({
        ...b,
        borderColor: s.isFocused ? '#462882' : '#EAEAEA',
        boxShadow: s.isFocused ? '0 0 0 3px rgba(70,40,130,0.08)' : 'none',
        borderRadius: '6px',
        fontSize: '14px',
        minHeight: '38px',
        '&:hover': { borderColor: '#462882' },
    }),
    option: (b, s) => ({
        ...b,
        fontSize: '13px',
        backgroundColor: s.isSelected ? '#462882' : s.isFocused ? '#F7F6F3' : 'white',
        color: s.isSelected ? 'white' : '#111111',
    }),
};

function Field({ label, children }) {
    return (
        <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#111111', marginBottom: '6px' }}>
                {label}
            </label>
            {children}
        </div>
    );
}

function StyledInput({ style: extraStyle, ...props }) {
    return (
        <input
            style={{ ...inputStyle, ...extraStyle }}
            onFocus={e => {
                e.target.style.borderColor = '#462882';
                e.target.style.boxShadow = '0 0 0 3px rgba(70,40,130,0.08)';
            }}
            onBlur={e => {
                e.target.style.borderColor = '#EAEAEA';
                e.target.style.boxShadow = 'none';
            }}
            {...props}
        />
    );
}

// ─── Modal de edición ──────────────────────────────────────────────────────
function EditUserModal({ user, prestadores, onSaved, onCancel }) {
    const [formData, setFormData] = useState({
        username: user.username || '',
        nombres: user.nombres || '',
        apellidos: user.apellidos || '',
        cedula: user.cedula || '',
        role: user.role || 'USER',
        password: '',
        confirmPassword: '',
    });
    const [prestadorId, setPrestadorId] = useState(user.id_prestador || null);
    const [showPassword, setShowPassword] = useState(false);
    const [saving, setSaving] = useState(false);

    const prestadorOptions = prestadores.map(p => ({
        value: p.id,
        label: `${p.nombre || p.id}${p.nit ? ' · NIT: ' + p.nit : ''}`,
    }));

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!formData.username.trim() || !formData.nombres.trim() || !formData.cedula.trim()) {
            return showError('Username, nombres y cédula son obligatorios');
        }
        if (formData.password && formData.password.length < 6) {
            return showError('La contraseña debe tener al menos 6 caracteres');
        }
        if (formData.password && formData.password !== formData.confirmPassword) {
            return showError('Las contraseñas no coinciden');
        }

        setSaving(true);
        try {
            const payload = {
                username: formData.username.trim(),
                nombres: formData.nombres.trim(),
                apellidos: formData.apellidos.trim(),
                cedula: formData.cedula.trim(),
                role: formData.role,
                id_prestador: prestadorId || null,
            };
            if (formData.password) payload.password = formData.password;

            await updateUser(user.id, payload);
            showSuccess('Usuario actualizado correctamente');
            onSaved();
        } catch (error) {
            showError(error.message || 'Error al actualizar el usuario');
        } finally {
            setSaving(false);
        }
    };

    return createPortal(
        <div
            style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: 'rgba(0,0,0,0.45)' }}
            onClick={onCancel}
        >
            <div
                style={{ backgroundColor: '#fff', borderRadius: 14, padding: '24px', width: '100%', maxWidth: 520, boxShadow: '0 20px 60px rgba(0,0,0,0.18)', maxHeight: '90vh', overflowY: 'auto' }}
                onClick={e => e.stopPropagation()}
            >
                <p style={{ fontSize: 16, fontWeight: 700, color: '#111111', marginBottom: 16 }}>Editar usuario</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Nombres">
                            <StyledInput name="nombres" value={formData.nombres} onChange={handleChange} required />
                        </Field>
                        <Field label="Apellidos (opcional para prestadores)">
                            <StyledInput name="apellidos" value={formData.apellidos} onChange={handleChange} />
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Cedula">
                            <StyledInput name="cedula" value={formData.cedula} onChange={handleChange} required />
                        </Field>
                        <Field label="Username">
                            <StyledInput name="username" value={formData.username} onChange={handleChange} required />
                        </Field>
                    </div>

                    <Field label="Rol">
                        <select
                            name="role" value={formData.role} onChange={handleChange}
                            style={{ ...inputStyle, cursor: 'pointer' }}
                        >
                            <option value="USER">Prestador</option>
                            <option value="ADMIN">Administrador</option>
                            <option value="SUPERADMIN">Superadmin</option>
                        </select>
                    </Field>

                    <Field label="Prestador asociado (opcional)">
                        <Select
                            options={prestadorOptions}
                            value={prestadorOptions.find(o => o.value === prestadorId) || null}
                            onChange={opt => setPrestadorId(opt ? opt.value : null)}
                            isClearable
                            placeholder="Buscar prestador..."
                            styles={SELECT_STYLES}
                            noOptionsMessage={() => 'Sin resultados'}
                        />
                    </Field>

                    <div style={{ borderTop: '1px solid #EAEAEA', paddingTop: 14 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#787774', marginBottom: 4 }}>
                            Cambiar contraseña (opcional)
                        </p>
                        <p style={{ fontSize: 11, color: '#787774', marginBottom: 10 }}>
                            Si estableces una nueva contraseña, el usuario deberá cambiarla en su próximo inicio de sesión.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Nueva contraseña">
                                <div className="relative">
                                    <StyledInput
                                        type={showPassword ? 'text' : 'password'}
                                        name="password" value={formData.password}
                                        onChange={handleChange} placeholder="••••••••"
                                        style={{ paddingRight: '40px' }}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#787774] hover:text-[#111111] transition-colors cursor-pointer">
                                        {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                                    </button>
                                </div>
                            </Field>
                            <Field label="Confirmar contraseña">
                                <StyledInput
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword" value={formData.confirmPassword}
                                    onChange={handleChange} placeholder="••••••••"
                                />
                            </Field>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, paddingTop: 6 }}>
                        <button type="button" onClick={onCancel}
                            style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: '1px solid #EAEAEA', backgroundColor: '#F9F9F8', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#111111' }}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={saving}
                            style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', backgroundColor: saving ? '#787774' : '#111111', fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', color: '#fff' }}>
                            {saving ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

// ─── Modal de confirmación de eliminación ─────────────────────────────────
function DeleteUserModal({ user, onConfirm, onCancel }) {
    return createPortal(
        <div
            style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: 'rgba(0,0,0,0.45)' }}
            onClick={onCancel}
        >
            <div
                style={{ backgroundColor: '#fff', borderRadius: 14, padding: '28px 24px', width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}
                onClick={e => e.stopPropagation()}
            >
                <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#111111', marginBottom: 4 }}>¿Eliminar usuario?</p>
                    <p style={{ fontSize: 13, color: '#787774' }}>
                        Se eliminará al usuario <span style={{ fontWeight: 600, color: '#111111' }}>{user.username}</span>. Esta acción puede revertirse solo desde la base de datos.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={onCancel} style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: '1px solid #EAEAEA', backgroundColor: '#F9F9F8', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#111111' }}>Cancelar</button>
                    <button
                        onClick={onConfirm}
                        style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', backgroundColor: '#B91C1C', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#fff' }}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

// ─── Componente principal ──────────────────────────────────────────────────
export default function UsersTable() {
    const currentUser = getUser();

    const [users, setUsers] = useState([]);
    const [prestadores, setPrestadores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [busqueda, setBusqueda] = useState('');

    const cargar = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargar();
        apiFetch('/api/auth/prestadores')
            .then(r => r.json())
            .then(data => setPrestadores(Array.isArray(data) ? data : []))
            .catch(() => {});
    }, [cargar]);

    const filtrados = users.filter(u => {
        if (!busqueda.trim()) return true;
        const q = busqueda.trim().toLowerCase();
        return [u.username, u.nombres, u.apellidos, u.cedula].some(v => String(v || '').toLowerCase().includes(q));
    });

    const handleDelete = async () => {
        if (!deleting) return;
        try {
            await deleteUser(deleting.id);
            showSuccess('Usuario eliminado correctamente');
            setDeleting(null);
            cargar();
        } catch (e) {
            showError(e.message || 'Error al eliminar el usuario');
        }
    };

    const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, color: '#787774', textTransform: 'uppercase', marginBottom: 4 };

    return (
        <div className="fade-up fade-up-1">
            <div className="mb-5 flex items-end justify-between gap-3 flex-wrap">
                <div>
                    <h1 className="text-xl font-semibold text-[#111111] tracking-tight">Gestionar usuarios</h1>
                    <p className="mt-1 text-sm text-[#787774]">Edita, elimina y administra los usuarios del sistema.</p>
                </div>
                <button
                    onClick={cargar}
                    disabled={loading}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1px solid #EAEAEA', backgroundColor: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, color: '#111111' }}
                >
                    <RefreshCw style={{ width: 14, height: 14 }} className={loading ? 'animate-spin' : ''} />
                    Actualizar
                </button>
            </div>

            <div style={{ border: '1px solid #EAEAEA', borderRadius: 10, backgroundColor: '#fff', padding: '14px 18px', marginBottom: 16 }}>
                <label style={labelStyle}>Buscar</label>
                <input
                    type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
                    placeholder="Username, nombre, apellido o cédula..."
                    style={{ width: '100%', padding: '6px 10px', borderRadius: 7, border: '1px solid #D1D5DB', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
            </div>

            {loading && (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <Loader2 style={{ width: 32, height: 32, color: '#1F6C9F', margin: '0 auto' }} className="animate-spin" />
                    <p style={{ marginTop: 12, fontSize: 14, color: '#787774' }}>Cargando usuarios...</p>
                </div>
            )}

            {error && !loading && (
                <div style={{ border: '1px solid #FECACA', borderRadius: 10, backgroundColor: '#FEF2F2', padding: '14px 18px' }}>
                    <p style={{ fontSize: 13, color: '#B91C1C', fontWeight: 600 }}>Error: {error}</p>
                </div>
            )}

            {!loading && !error && filtrados.length === 0 && (
                <div style={{ border: '1px solid #EAEAEA', borderRadius: 10, backgroundColor: '#F9F9F8', padding: '48px 0', textAlign: 'center' }}>
                    <p style={{ fontSize: 14, color: '#787774' }}>No hay usuarios que coincidan.</p>
                </div>
            )}

            {!loading && !error && filtrados.length > 0 && (
                <div style={{ border: '1px solid #EAEAEA', borderRadius: 10, backgroundColor: '#fff', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                            <tr style={{ backgroundColor: '#F9F9F8', borderBottom: '1px solid #EAEAEA' }}>
                                {['Usuario', 'Nombre completo', 'Cédula', 'Rol', 'Prestador', ''].map((h, i) => (
                                    <th key={i} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#787774', textTransform: 'uppercase' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtrados.map(u => {
                                const palette = ROLE_COLORS[u.role] || ROLE_COLORS.USER;
                                const isSelf = currentUser?.id === u.id;
                                return (
                                    <tr key={u.id} style={{ borderBottom: '1px solid #F0F0EF' }}>
                                        <td style={{ padding: '10px 16px', fontWeight: 600, color: '#111111' }}>{u.username}</td>
                                        <td style={{ padding: '10px 16px', color: '#111111' }}>{[u.nombres, u.apellidos].filter(Boolean).join(' ') || '—'}</td>
                                        <td style={{ padding: '10px 16px', color: '#787774' }}>{u.cedula || '—'}</td>
                                        <td style={{ padding: '10px 16px' }}>
                                            <span style={{ backgroundColor: palette.bg, color: palette.color, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>
                                                {ROLE_LABELS[u.role] || u.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px 16px', color: '#787774' }}>{u.prestador?.nombre_prestador || '—'}</td>
                                        <td style={{ padding: '10px 16px' }}>
                                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                                <button
                                                    onClick={() => setEditing(u)}
                                                    style={{ padding: '5px', borderRadius: 6, border: '1px solid #BFDBFE', backgroundColor: '#EFF6FF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                                    title="Editar usuario"
                                                >
                                                    <Pencil style={{ width: 14, height: 14, color: '#1D4ED8' }} />
                                                </button>
                                                <button
                                                    onClick={() => !isSelf && setDeleting(u)}
                                                    disabled={isSelf}
                                                    style={{ padding: '5px', borderRadius: 6, border: '1px solid #FECACA', backgroundColor: isSelf ? '#F5F5F4' : '#FEF2F2', cursor: isSelf ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', opacity: isSelf ? 0.5 : 1 }}
                                                    title={isSelf ? 'No puedes eliminar tu propio usuario' : 'Eliminar usuario'}
                                                >
                                                    <Trash2 style={{ width: 14, height: 14, color: '#B91C1C' }} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {editing && (
                <EditUserModal
                    user={editing}
                    prestadores={prestadores}
                    onSaved={() => { setEditing(null); cargar(); }}
                    onCancel={() => setEditing(null)}
                />
            )}

            {deleting && (
                <DeleteUserModal
                    user={deleting}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleting(null)}
                />
            )}
        </div>
    );
}
