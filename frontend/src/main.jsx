import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { getToken } from './lib/auth'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import UploadJson from './pages/UploadJson.jsx'
import Consultar from './pages/Consultar.jsx'
import { AdminRoute } from './components/RouteGuards.jsx'

function PrivateRoute({ children }) {
  return getToken() ? children : <Navigate to="/login" />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute> <Dashboard /> </PrivateRoute>} />
        <Route path="/upload-json" element={<AdminRoute> <UploadJson /> </AdminRoute>} />
        <Route path="/consultar" element={<PrivateRoute> <Consultar /> </PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
