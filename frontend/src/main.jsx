import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'



import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getToken } from './lib/auth'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import UploadJson from './pages/UploadJson.jsx'
import Consultar from './pages/Consultar.jsx'
import Layout from './components/Layout.jsx'
import { AdminRoute } from './components/RouteGuards.jsx'
import NotFound from './pages/NotFound.jsx'
import ListBills from './pages/ListBills.jsx'
import CreateUser from './pages/CreateUser.jsx'
import SearchCuv from './pages/SearchCuv.jsx'
import CompareCuvXml from './pages/CompareCuvXml.jsx'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const withPrivateLayout = (children) =>
  getToken() ? <Layout>{children}</Layout> : <Navigate to="/login" />;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={getToken() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={withPrivateLayout(<Dashboard />)} />
        <Route path="/upload-json" element={<AdminRoute><Layout><UploadJson /></Layout></AdminRoute>} />
        <Route path="/crear-usuario" element={<AdminRoute><Layout><CreateUser /></Layout></AdminRoute>} />
        <Route path="/consultar" element={withPrivateLayout(<Consultar />)} />
        <Route path="/consultar-cuv" element={withPrivateLayout(<SearchCuv />)} />
        <Route path="/comparar-cuv-xml" element={withPrivateLayout(<CompareCuvXml />)} />
        <Route path="/gestionar-facturas" element={withPrivateLayout(<ListBills />)} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
