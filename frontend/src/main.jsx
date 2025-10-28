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

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function PrivateRoute({ children }) {
  return getToken() ? <Layout>{children}</Layout> : <Navigate to="/login" />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/upload-json" element={<AdminRoute><Layout><UploadJson /></Layout></AdminRoute>} />
        <Route path="/crear-usuario" element={<AdminRoute><Layout><CreateUser /></Layout></AdminRoute>} />
        <Route path="/consultar" element={<PrivateRoute><Consultar /></PrivateRoute>} />
        <Route path="/consultar-cuv" element={<PrivateRoute><SearchCuv /></PrivateRoute>} />
        <Route path="/gestionar-facturas" element={<PrivateRoute><ListBills /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
