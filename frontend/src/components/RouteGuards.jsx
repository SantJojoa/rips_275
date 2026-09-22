import { Navigate } from 'react-router-dom';
import { getToken, isAdmin, isSuperAdmin, mustChangePassword } from '../lib/auth';

export function PrivateRoute({ children }) {
    if (!getToken()) return <Navigate to="/login" />;
    if (mustChangePassword()) return <Navigate to="/cambiar-password" replace />;
    return children;
}

export function AdminRoute({ children }) {
    if (!getToken()) return <Navigate to="/login" replace />;
    if (mustChangePassword()) return <Navigate to="/cambiar-password" replace />;
    return isAdmin() ? children : <Navigate to="/dashboard" replace />;
}

export function SuperAdminRoute({ children }) {
    if (!getToken()) return <Navigate to="/login" replace />;
    if (mustChangePassword()) return <Navigate to="/cambiar-password" replace />;
    return isSuperAdmin() ? children : <Navigate to="/dashboard" replace />;
}