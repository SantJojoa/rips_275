import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getToken, isTokenExpired, clearToken } from './lib/auth'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Consultar from './pages/Consultar.jsx'
import Layout from './components/Layout.jsx'
import { AdminRoute, SuperAdminRoute } from './components/RouteGuards.jsx'
import NotFound from './pages/NotFound.jsx'
import ListBills from './pages/ListBills.jsx'
import CreateUser from './pages/CreateUser.jsx'
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
  return token ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

const RootRedirect = () => {
  const token = getToken();
  if (token && isTokenExpired(token)) {
    clearToken();
    return <Navigate to="/login" />;
  }
  return token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={withPrivateLayout(<Dashboard />)} />
        <Route path="/consultar" element={withPrivateLayout(<Consultar />)} />
        <Route path="/consultar-cuv" element={<AdminRoute><Layout><SearchCuv /></Layout></AdminRoute>} />
        <Route path="/gestionar-facturas" element={<AdminRoute><Layout><ListBills /></Layout></AdminRoute>} />
        <Route path="/cargar-factura" element={withPrivateLayout(<CargarFactura />)} />
        <Route path="/crear-usuario" element={<SuperAdminRoute><Layout><CreateUser /></Layout></SuperAdminRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
