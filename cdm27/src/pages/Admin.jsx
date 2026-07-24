import React, { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const emptyForm = { poule: '', equipe1: '', equipe2: '', date: '', lieu: '' }

export default function Admin() {
  const { isAdmin, loading } = useAuth()
  const [matches, setMatches] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [resultats, setResultats] = useState({}) // { matchId: {score1, score2} }
  const [enregistrement, setEnregistrement] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'matches'), orderBy('date', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      setMatches(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [])

  if (loading) return null
  if (!isAdmin) return <Navigate to="/pronostics" replace />

  async function handleAjoutMatch(e) {
    e.preventDefault()
    if (!form.poule || !form.equipe1 || !form.equipe2 || !form.date) return
    await addDoc(collection(db, 'matches'), {
      poule: form.poule.trim().toUpperCase(),
      equipe1: form.equipe1.trim(),
      equipe2: form.equipe2.trim(),
      date: new Date(form.date).toISOString(),
      lieu: form.lieu.trim(),
      score1: null,
      score2: null,
      statut: 'a_venir',
    })
    setForm(emptyForm)
  }

  async function handleSuppression(id) {
    if (!confirm('Supprimer ce match et son résultat ?')) return
    await deleteDoc(doc(db, 'matches', id))
  }

  function handleResultatChange(matchId, field, value) {
    const v = value.replace(/[^0-9]/g, '')
    setResultats((prev) => ({
      ...prev,
      [matchId]: { ...prev[matchId], [field]: v === '' ? '' : Number(v) },
    }))
  }

  async function handleEnregistrerResultat(match) {
    const saisie = resultats[match.id]
    const score1 = saisie?.score1 ?? match.score1
    const score2 = saisie?.score2 ?? match.score2
    if (score1 === '' || score2 === '' || score1 == null || score2 == null) return

    setEnregistrement(match.id)
    try {
      await updateDoc(doc(db, 'matches', match.id), {
        score1: Number(score1),
        score2: Number(score2),
        statut: 'termine',
      })
    } finally {
      setEnregistrement(null)
    }
  }

  async function handleReouvrirMatch(match) {
    await updateDoc(doc(db, 'matches', match.id), {
      statut: 'a_venir',
    })
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-1 text-xl font-extrabold text-slate-900">Espace Admin</h1>
      <p className="mb-6 text-sm text-slate-500">
        Ajoutez les matchs et saisissez les résultats réels au fur et à mesure du tournoi.
      </p>

      <section className="card mb-8">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
          Ajouter un match
        </h2>
        <form onSubmit={handleAjoutMatch} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <input
            className="input"
            placeholder="Poule (ex: A)"
            value={form.poule}
            onChange={(e) => setForm({ ...form, poule: e.target.value })}
          />
          <input
            className="input col-span-2 sm:col-span-1"
            placeholder="Équipe 1"
            value={form.equipe1}
            onChange={(e) => setForm({ ...form, equipe1: e.target.value })}
          />
          <input
            className="input col-span-2 sm:col-span-1"
            placeholder="Équipe 2"
            value={form.equipe2}
            onChange={(e) => setForm({ ...form, equipe2: e.target.value })}
          />
          <input
            type="datetime-local"
            className="input col-span-2 sm:col-span-1"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <input
            className="input col-span-2 sm:col-span-2"
            placeholder="Lieu (ex: Sydney)"
            value={form.lieu}
            onChange={(e) => setForm({ ...form, lieu: e.target.value })}
          />
          <button type="submit" className="btn-primary col-span-2 sm:col-span-1">
            Ajouter le match
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
          Matchs ({matches.length})
        </h2>

        <div className="flex flex-col gap-3">
          {matches.map((match) => {
            const saisie = resultats[match.id]
            const s1 = saisie?.score1 ?? (match.score1 ?? '')
            const s2 = saisie?.score2 ?? (match.score2 ?? '')
            return (
              <div key={match.id} className="card flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="badge bg-rugby-50 text-rugby-700">Poule {match.poule}</span>
                  <div className="text-sm">
                    <span className="font-semibold text-slate-800">{match.equipe1}</span>
                    <span className="mx-1.5 text-slate-300">vs</span>
                    <span className="font-semibold text-slate-800">{match.equipe2}</span>
                    <div className="text-xs text-slate-400">
                      {match.lieu} · {match.date && new Date(match.date).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={s1}
                    onChange={(e) => handleResultatChange(match.id, 'score1', e.target.value)}
                    className="input w-14 text-center"
                    placeholder="-"
                  />
                  <span className="text-slate-300">:</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={s2}
                    onChange={(e) => handleResultatChange(match.id, 'score2', e.target.value)}
                    className="input w-14 text-center"
                    placeholder="-"
                  />

                  {match.statut === 'termine' ? (
                    <>
                      <span className="badge bg-try_green-500/10 text-try_green-600">Terminé</span>
                      <button
                        onClick={() => handleReouvrirMatch(match)}
                        className="btn-secondary !py-1.5 text-xs"
                      >
                        Modifier
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEnregistrerResultat(match)}
                      disabled={enregistrement === match.id}
                      className="btn-primary !py-1.5 text-xs"
                    >
                      Valider
                    </button>
                  )}

                  <button
                    onClick={() => handleSuppression(match.id)}
                    className="btn-danger !py-1.5 text-xs"
                  >
                    Suppr.
                  </button>
                </div>
              </div>
            )
          })}

          {matches.length === 0 && (
            <div className="card text-center text-sm text-slate-500">
              Aucun match pour le moment. Ajoutez le premier ci-dessus.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
