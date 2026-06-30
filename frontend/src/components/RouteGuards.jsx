import { Navigate } from 'react-router-dom';
import { getToken, isAdmin, isSuperAdmin } from '../lib/auth';

export function PrivateRoute({ children }) {
    return getToken() ? children : <Navigate to="/login" />
}

export function AdminRoute({ children }) {
    if (!getToken()) return <Navigate to="/login" replace />;
    return isAdmin() ? children : <Navigate to="/dashboard" replace />;
}

export function SuperAdminRoute({ children }) {
    if (!getToken()) return <Navigate to="/login" replace />;
    return isSuperAdmin() ? children : <Navigate to="/dashboard" replace />;
}