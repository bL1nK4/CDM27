import React, { useEffect, useMemo, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { calculatePoints } from '../utils/points'

export default function Classement() {
  const { user } = useAuth()
  const [utilisateurs, setUtilisateurs] = useState([])
  const [matches, setMatches] = useState([])
  const [pronostics, setPronostics] = useState([])
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUtilisateurs(snap.docs.map((d) => ({ uid: d.id, ...d.data() })))
    })
    const unsubMatches = onSnapshot(collection(db, 'matches'), (snap) => {
      setMatches(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    const unsubPronos = onSnapshot(collection(db, 'pronostics'), (snap) => {
      setPronostics(snap.docs.map((d) => d.data()))
      setChargement(false)
    })
    return () => {
      unsubUsers()
      unsubMatches()
      unsubPronos()
    }
  }, [])

  const classement = useMemo(() => {
    const matchesTermines = matches.filter((m) => m.statut === 'termine')
    const matchesParId = Object.fromEntries(matchesTermines.map((m) => [m.id, m]))

    const scores = utilisateurs.map((u) => {
      let points = 0
      let scoresExacts = 0
      let bonsVainqueurs = 0
      let matchsJoues = 0

      pronostics
        .filter((p) => p.uid === u.uid && matchesParId[p.matchId])
        .forEach((p) => {
          const m = matchesParId[p.matchId]
          const pts = calculatePoints(p.score1, p.score2, m.score1, m.score2)
          points += pts
          matchsJoues += 1
          if (pts === 5) scoresExacts += 1
          if (pts === 3) bonsVainqueurs += 1
        })

      return {
        uid: u.uid,
        pseudo: u.pseudo || u.email,
        points,
        scoresExacts,
        bonsVainqueurs,
        matchsJoues,
      }
    })

    return scores.sort((a, b) => b.points - a.points || b.scoresExacts - a.scoresExacts)
  }, [utilisateurs, matches, pronostics])

  const medaille = ['🥇', '🥈', '🥉']

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-1 text-xl font-extrabold text-slate-900">Classement général</h1>
      <p className="mb-6 text-sm text-slate-500">
        Mis à jour automatiquement dès qu'un résultat est saisi par l'admin.
      </p>

      {chargement ? (
        <p className="text-sm text-slate-400">Chargement du classement…</p>
      ) : classement.length === 0 ? (
        <div className="card text-center text-sm text-slate-500">
          Aucun participant pour le moment.
        </div>
      ) : (
        <div className="card !p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Joueur</th>
                <th className="px-4 py-3 text-center">Matchs</th>
                <th className="px-4 py-3 text-center">Score exact</th>
                <th className="px-4 py-3 text-center">Bon résultat</th>
                <th className="px-4 py-3 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {classement.map((row, i) => (
                <tr
                  key={row.uid}
                  className={`border-b border-slate-50 last:border-0 ${
                    row.uid === user?.uid ? 'bg-rugby-50/60' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-semibold text-slate-500">
                    {medaille[i] || i + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {row.pseudo}
                    {row.uid === user?.uid && (
                      <span className="ml-2 badge bg-rugby-100 text-rugby-700">Vous</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-500">{row.matchsJoues}</td>
                  <td className="px-4 py-3 text-center text-slate-500">{row.scoresExacts}</td>
                  <td className="px-4 py-3 text-center text-slate-500">{row.bonsVainqueurs}</td>
                  <td className="px-4 py-3 text-right text-base font-extrabold text-rugby-700">
                    {row.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
