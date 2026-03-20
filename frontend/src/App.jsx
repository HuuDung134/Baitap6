import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import TicketValidation from './pages/TicketValidation.jsx'
import ManualInspection from './pages/ManualInspection.jsx'
import AdminUsers from './pages/AdminUsers.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />

            <Route element={<ProtectedRoute allowRoles={['staff']} />}>
              <Route path="/staff/validate" element={<TicketValidation />} />
            </Route>

            <Route element={<ProtectedRoute allowRoles={['inspector']} />}>
              <Route path="/inspector/manual" element={<ManualInspection />} />
            </Route>

            <Route element={<ProtectedRoute allowRoles={['admin']} />}>
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
