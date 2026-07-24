import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Pronostics from './pages/Pronostics'
import Classement from './pages/Classement'
import Admin from './pages/Admin'

function RouteProtegee({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-400">Chargement…</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/connexion" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route
          path="/connexion"
          element={user ? <Navigate to="/pronostics" replace /> : <Login />}
        />
        <Route
          path="/pronostics"
          element={
            <RouteProtegee>
              <Pronostics />
            </RouteProtegee>
          }
        />
        <Route
          path="/classement"
          element={
            <RouteProtegee>
              <Classement />
            </RouteProtegee>
          }
        />
        <Route
          path="/admin"
          element={
            <RouteProtegee>
              <Admin />
            </RouteProtegee>
          }
        />
        <Route path="*" element={<Navigate to="/pronostics" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
