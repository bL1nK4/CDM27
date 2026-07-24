import React, { useEffect, useMemo, useState } from 'react'
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  setDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import MatchCard from '../components/MatchCard'

export default function Pronostics() {
  const { user } = useAuth()
  const [matches, setMatches] = useState([])
  const [pronostics, setPronostics] = useState({}) // { matchId: {score1, score2} }
  const [chargement, setChargement] = useState(true)
  const [savingId, setSavingId] = useState(null)
  const [pouleFiltre, setPouleFiltre] = useState('Toutes')

  useEffect(() => {
    const q = query(collection(db, 'matches'), orderBy('date', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      setMatches(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setChargement(false)
    })
    return unsub
  }, [])

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, 'pronostics'))
    const unsub = onSnapshot(q, (snap) => {
      const mine = {}
      snap.docs.forEach((d) => {
        const data = d.data()
        if (data.uid === user.uid) {
          mine[data.matchId] = data
        }
      })
      setPronostics(mine)
    })
    return unsub
  }, [user])

  async function handleSavePronostic(matchId, score1, score2) {
    if (!user) return
    setSavingId(matchId)
    try {
      const id = `${user.uid}_${matchId}`
      await setDoc(doc(db, 'pronostics', id), {
        uid: user.uid,
        matchId,
        score1,
        score2,
        updatedAt: new Date().toISOString(),
      })
    } finally {
      setSavingId(null)
    }
  }

  const poules = useMemo(() => {
    const set = new Set(matches.map((m) => m.poule).filter(Boolean))
    return ['Toutes', ...Array.from(set).sort()]
  }, [matches])

  const matchesAffiches = useMemo(() => {
    if (pouleFiltre === 'Toutes') return matches
    return matches.filter((m) => m.poule === pouleFiltre)
  }, [matches, pouleFiltre])

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Mes pronostics</h1>
          <p className="text-sm text-slate-500">
            3 points pour le bon vainqueur, 5 points pour le score exact.
          </p>
        </div>

        {poules.length > 1 && (
          <select
            value={pouleFiltre}
            onChange={(e) => setPouleFiltre(e.target.value)}
            className="input w-auto"
          >
            {poules.map((p) => (
              <option key={p} value={p}>
                {p === 'Toutes' ? 'Toutes les poules' : `Poule ${p}`}
              </option>
            ))}
          </select>
        )}
      </div>

      {chargement ? (
        <p className="text-sm text-slate-400">Chargement des matchs…</p>
      ) : matchesAffiches.length === 0 ? (
        <div className="card text-center text-sm text-slate-500">
          Aucun match n'a encore été ajouté. Revenez bientôt !
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matchesAffiches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              prono={pronostics[match.id]}
              onSave={handleSavePronostic}
              saving={savingId === match.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
