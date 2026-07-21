import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import { showError, showSuccess } from '../utils/toastUtils';
import { Eye, EyeOff } from 'lucide-react';
import Select from 'react-select';

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

export default function CreateUser() {
    const [formData, setFormData] = useState({
        username: '', nombres: '', apellidos: '',
        cedula: '', password: '', confirmPassword: '', role: 'USER'
    });
    const [prestadores, setPrestadores] = useState([]);
    const [prestadorId, setPrestadorId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        apiFetch('/api/auth/prestadores')
            .then(r => r.json())
            .then(data => setPrestadores(Array.isArray(data) ? data : []))
            .catch(() => {});
    }, []);

    const prestadorOptions = prestadores.map(p => ({
        value: p.id,
        label: `${p.nombre || p.id}${p.nit ? ' · NIT: ' + p.nit : ''}${p.cod ? ' (' + p.cod + ')' : ''}`,
    }));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.nombres || !formData.apellidos || !formData.cedula || !formData.password)
            return showError('Todos los campos son obligatorios');
        if (formData.password !== formData.confirmPassword)
            return showError('Las contraseñas no coinciden');
        if (formData.password.length < 6)
            return showError('La contraseña debe tener al menos 6 caracteres');
        if (formData.role === 'USER' && !prestadorId)
            return showError('Los usuarios deben estar asociados a un prestador');

        setLoading(true);
        try {
            const res = await apiFetch('/api/auth/create-user', {
                method: 'POST',
                body: JSON.stringify({
                    username: formData.username, nombres: formData.nombres,
                    apellidos: formData.apellidos, cedula: formData.cedula,
                    password: formData.password, role: formData.role,
                    id_prestador: prestadorId || null,
                })
            });
            const data = await res.json();
            if (!res.ok) return showError(data?.message || 'Error al crear el usuario');
            showSuccess(data?.message || 'Usuario creado exitosamente');
            setFormData({ username: '', nombres: '', apellidos: '', cedula: '', password: '', confirmPassword: '', role: 'USER' });
            setPrestadorId(null);
        } catch (error) {
            showError(error?.message || 'Error al crear el usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-up fade-up-1">
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-[#111111] tracking-tight">Crear Usuario</h1>
                <p className="mt-1 text-sm text-[#787774]">
                    Registra un nuevo usuario en el sistema con sus respectivos permisos.
                </p>
            </div>

            <div style={{ border: '1px solid #EAEAEA', borderRadius: '8px', backgroundColor: '#ffffff' }}
                className="p-6 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Nombres">
                            <StyledInput type="text" name="nombres" value={formData.nombres}
                                onChange={handleChange} placeholder="Nombres completos" required />
                        </Field>
                        <Field label="Apellidos">
                            <StyledInput type="text" name="apellidos" value={formData.apellidos}
                                onChange={handleChange} placeholder="Apellidos completos" required />
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Cedula">
                            <StyledInput type="text" name="cedula" value={formData.cedula}
                                onChange={handleChange} placeholder="Numero de cedula" required />
                        </Field>
                        <Field label="Username">
                            <StyledInput type="text" name="username" value={formData.username}
                                onChange={handleChange} placeholder="Nombre de usuario" required />
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Contrasena">
                            <div className="relative">
                                <StyledInput
                                    type={showPassword ? 'text' : 'password'}
                                    name="password" value={formData.password}
                                    onChange={handleChange} placeholder="••••••••"
                                    style={{ paddingRight: '40px' }} required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#787774] hover:text-[#111111] transition-colors cursor-pointer">
                                    {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                                </button>
                            </div>
                        </Field>
                        <Field label="Confirmar contrasena">
                            <div className="relative">
                                <StyledInput
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword" value={formData.confirmPassword}
                                    onChange={handleChange} placeholder="••••••••"
                                    style={{ paddingRight: '40px' }} required />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#787774] hover:text-[#111111] transition-colors cursor-pointer">
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                                </button>
                            </div>
                        </Field>
                    </div>

                    <Field label="Rol">
                        <select
                            name="role" value={formData.role} onChange={handleChange}
                            style={{ ...inputStyle, cursor: 'pointer' }}
                            onFocus={e => {
                                e.target.style.borderColor = '#462882';
                                e.target.style.boxShadow = '0 0 0 3px rgba(70,40,130,0.08)';
                            }}
                            onBlur={e => {
                                e.target.style.borderColor = '#EAEAEA';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            <option value="USER">Usuario</option>
                            <option value="ADMIN">Administrador</option>
                        </select>
                    </Field>

                    <Field label={`Prestador asociado${formData.role === 'USER' ? ' *' : ' (opcional)'}`}>
                        <Select
                            options={prestadorOptions}
                            value={prestadorOptions.find(o => o.value === prestadorId) || null}
                            onChange={opt => setPrestadorId(opt ? opt.value : null)}
                            isClearable
                            placeholder="Buscar prestador..."
                            styles={SELECT_STYLES}
                            noOptionsMessage={() => 'Sin resultados'}
                        />
                        <p style={{ fontSize: '11px', color: '#787774', marginTop: '4px' }}>
                            {formData.role === 'USER'
                                ? 'El usuario solo podrá subir facturas del prestador asignado.'
                                : 'Para roles ADMIN/SUPERADMIN el prestador es opcional.'}
                        </p>
                    </Field>

                    <div style={{ borderTop: '1px solid #EAEAEA' }} className="pt-4">
                        <button
                            type="submit" disabled={loading}
                            style={{
                                backgroundColor: loading ? '#787774' : '#111111',
                                borderRadius: '6px',
                                transition: 'background-color 150ms, transform 100ms',
                            }}
                            onMouseDown={e => { if (!loading) e.currentTarget.style.transform = 'scale(0.98)'; }}
                            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                            className="px-5 py-2.5 text-sm font-semibold text-white cursor-pointer disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creando...' : 'Crear usuario'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
