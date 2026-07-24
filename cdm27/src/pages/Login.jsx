import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [mode, setMode] = useState('connexion') // 'connexion' | 'inscription'
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [pseudo, setPseudo] = useState('')
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(false)

  const { connexion, inscription } = useAuth()
  const navigate = useNavigate()

  function messageErreur(code) {
    const messages = {
      'auth/email-already-in-use': 'Cet email est déjà utilisé.',
      'auth/invalid-email': 'Adresse email invalide.',
      'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères.',
      'auth/invalid-credential': 'Email ou mot de passe incorrect.',
      'auth/user-not-found': 'Aucun compte ne correspond à cet email.',
      'auth/wrong-password': 'Mot de passe incorrect.',
    }
    return messages[code] || 'Une erreur est survenue. Veuillez réessayer.'
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')
    setChargement(true)
    try {
      if (mode === 'connexion') {
        await connexion(email, motDePasse)
      } else {
        if (!pseudo.trim()) {
          setErreur('Merci de choisir un pseudonyme.')
          setChargement(false)
          return
        }
        await inscription(email, motDePasse, pseudo.trim())
      }
      navigate('/pronostics')
    } catch (err) {
      setErreur(messageErreur(err.code))
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rugby-950 to-rugby-800 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-lg">
            🏉
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            CDM<span className="text-rugby-300">27</span>
          </h1>
          <p className="mt-1 text-sm text-rugby-200">
            Pronostics Coupe du Monde de Rugby 2027
          </p>
        </div>

        <div className="card">
          <div className="mb-5 flex rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setMode('connexion')}
              className={`flex-1 rounded-md py-1.5 text-sm font-semibold transition-colors ${
                mode === 'connexion' ? 'bg-white shadow-sm text-rugby-700' : 'text-slate-500'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setMode('inscription')}
              className={`flex-1 rounded-md py-1.5 text-sm font-semibold transition-colors ${
                mode === 'inscription' ? 'bg-white shadow-sm text-rugby-700' : 'text-slate-500'
              }`}
            >
              Inscription
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === 'inscription' && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Pseudonyme
                </label>
                <input
                  type="text"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  className="input"
                  placeholder="ex : LeBlackFoot"
                  required
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="vous@exemple.com"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Mot de passe
              </label>
              <input
                type="password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className="input"
                placeholder="6 caractères minimum"
                minLength={6}
                required
              />
            </div>

            {erreur && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                {erreur}
              </p>
            )}

            <button type="submit" disabled={chargement} className="btn-primary mt-2">
              {chargement
                ? 'Veuillez patienter…'
                : mode === 'connexion'
                ? 'Se connecter'
                : "S'inscrire"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-rugby-300">
          Le tout premier compte créé devient automatiquement administrateur.
        </p>
      </div>
    </div>
  )
}
