import { useState } from 'react';
import { apiFetch } from '../lib/api';
import { showError, showSuccess } from '../utils/toastUtils';
import { Eye, EyeOff } from 'lucide-react';

export default function CreateUser() {
    const [formData, setFormData] = useState({
        username: '',
        nombres: '',
        apellidos: '',
        cedula: '',
        password: '',
        confirmPassword: '',
        role: 'USER'
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!formData.username || !formData.nombres || !formData.apellidos || !formData.cedula || !formData.password) {
            return showError('Todos los campos son obligatorios');
        }

        if (formData.password !== formData.confirmPassword) {
            return showError('Las contraseñas no coinciden');
        }

        if (formData.password.length < 6) {
            return showError('La contraseña debe tener al menos 6 caracteres');
        }

        setLoading(true);

        try {
            const res = await apiFetch('/api/auth/create-user', {
                method: 'POST',
                body: JSON.stringify({
                    username: formData.username,
                    nombres: formData.nombres,
                    apellidos: formData.apellidos,
                    cedula: formData.cedula,
                    password: formData.password,
                    role: formData.role
                })
            });

            const data = await res.json();

            if (!res.ok) {
                return showError(data?.message || 'Error al crear el usuario');
            }

            showSuccess(data?.message || 'Usuario creado exitosamente');

            // Limpiar formulario
            setFormData({
                username: '',
                nombres: '',
                apellidos: '',
                cedula: '',
                password: '',
                confirmPassword: '',
                role: 'USER'
            });
        } catch (error) {
            showError(error?.message || 'Error al crear el usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-6 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200 p-10 transition">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Crear Usuario</h1>
                    <p className="text-slate-500 mt-2 text-sm">Registra un nuevo usuario en el sistema</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nombres</label>
                            <input
                                type="text"
                                name="nombres"
                                value={formData.nombres}
                                onChange={handleChange}
                                placeholder="Ingrese los nombres"
                                required
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-400/40 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Apellidos</label>
                            <input
                                type="text"
                                name="apellidos"
                                value={formData.apellidos}
                                onChange={handleChange}
                                placeholder="Ingrese los apellidos"
                                required
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-400/40 transition"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Cédula</label>
                            <input
                                type="text"
                                name="cedula"
                                value={formData.cedula}
                                onChange={handleChange}
                                placeholder="Ingrese la cédula"
                                required
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-400/40 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Ingrese el username"
                                required
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-400/40 transition"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 pr-11 text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-400/40 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar contraseña</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 pr-11 text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-400/40 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 shadow-sm focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-400/40 transition"
                        >
                            <option value="USER">Usuario</option>
                            <option value="ADMIN">Administrador</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer w-full py-3 rounded-xl bg-sky-600 text-white font-medium shadow hover:bg-sky-700 focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creando usuario...' : 'Crear usuario'}
                    </button>
                </form>
            </div>
        </div>
    );
}
