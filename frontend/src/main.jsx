import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getToken, isTokenExpired, clearToken, mustChangePassword } from './lib/auth'
import Login from './pages/Login.jsx'
import ChangePassword from './pages/ChangePassword.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Consultar from './pages/Consultar.jsx'
import Layout from './components/Layout.jsx'
import { AdminRoute, SuperAdminRoute } from './components/RouteGuards.jsx'
import NotFound from './pages/NotFound.jsx'
import ListBills from './pages/ListBills.jsx'
import CreateUser from './pages/CreateUser.jsx'
import ManageUsers from './pages/ManageUsers.jsx'
import SearchCuv from './pages/SearchCuv.jsx'
import CargarFactura from './pages/CargarFactura.jsx'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const withPrivateLayout = (children) => {
  const token = getToken();
  if (token && isTokenExpired(token)) {
    clearToken();
    return <Navigate to="/login" />;
  }
  if (!token) return <Navigate to="/login" />;
  if (mustChangePassword()) return <Navigate to="/cambiar-password" replace />;
  return <Layout>{children}</Layout>;
};

const RootRedirect = () => {
  const token = getToken();
  if (token && isTokenExpired(token)) {
    clearToken();
    return <Navigate to="/login" />;
  }
  if (!token) return <Navigate to="/login" />;
  if (mustChangePassword()) return <Navigate to="/cambiar-password" replace />;
  return <Navigate to="/dashboard" />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable={false}
      theme="light"
    />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cambiar-password" element={getToken() ? <ChangePassword /> : <Navigate to="/login" replace />} />
        <Route path="/dashboard" element={withPrivateLayout(<Dashboard />)} />
        <Route path="/consultar" element={withPrivateLayout(<Consultar />)} />
        <Route path="/consultar-cuv" element={<AdminRoute><Layout><SearchCuv /></Layout></AdminRoute>} />
        <Route path="/gestionar-facturas" element={<AdminRoute><Layout><ListBills /></Layout></AdminRoute>} />
        <Route path="/cargar-factura" element={withPrivateLayout(<CargarFactura />)} />
        <Route path="/crear-usuario" element={<SuperAdminRoute><Layout><CreateUser /></Layout></SuperAdminRoute>} />
        <Route path="/gestionar-usuarios" element={<SuperAdminRoute><Layout><ManageUsers /></Layout></SuperAdminRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
