import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const linkBase =
  'px-3 py-2 rounded-lg text-sm font-medium transition-colors'
const linkActive = 'bg-rugby-700 text-white'
const linkInactive = 'text-slate-600 hover:bg-slate-100'

export default function Navbar() {
  const { user, profile, isAdmin, deconnexion } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await deconnexion()
    navigate('/connexion')
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rugby-700 text-white font-bold">
            🏉
          </div>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            CDM<span className="text-rugby-700">27</span>
          </span>
        </div>

        {user && (
          <nav className="flex items-center gap-1">
            <NavLink
              to="/pronostics"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Pronostics
            </NavLink>
            <NavLink
              to="/classement"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Classement
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                Admin
              </NavLink>
            )}
          </nav>
        )}

        {user && (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:inline">
              {profile?.pseudo || user.email}
            </span>
            <button onClick={handleLogout} className="btn-secondary !py-1.5">
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
