import React, { useEffect, useState } from 'react'
import { calculatePoints } from '../utils/points'

function formatDate(iso) {
  if (!iso) return 'Date à confirmer'
  const d = new Date(iso)
  return d.toLocaleString('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function MatchCard({ match, prono, onSave, saving }) {
  const [score1, setScore1] = useState(prono?.score1 ?? '')
  const [score2, setScore2] = useState(prono?.score2 ?? '')
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    setScore1(prono?.score1 ?? '')
    setScore2(prono?.score2 ?? '')
    setDirty(false)
  }, [prono?.score1, prono?.score2])

  const estTermine = match.statut === 'termine'
  const verrouille = estTermine // on ne peut plus pronostiquer un match joué

  const pointsObtenus =
    estTermine && prono
      ? calculatePoints(prono.score1, prono.score2, match.score1, match.score2)
      : null

  function handleChange(setter) {
    return (e) => {
      const v = e.target.value.replace(/[^0-9]/g, '')
      setter(v === '' ? '' : Number(v))
      setDirty(true)
    }
  }

  function handleSave() {
    if (score1 === '' || score2 === '') return
    onSave(match.id, Number(score1), Number(score2))
    setDirty(false)
  }

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="badge bg-rugby-50 text-rugby-700">Poule {match.poule}</span>
        <span className="text-xs text-slate-400">{formatDate(match.date)}</span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <span className="text-right text-sm font-semibold text-slate-800">
          {match.equipe1}
        </span>

        <div className="flex items-center gap-1.5">
          <input
            type="text"
            inputMode="numeric"
            value={score1}
            onChange={handleChange(setScore1)}
            disabled={verrouille}
            className="input w-12 text-center font-bold"
            placeholder="-"
          />
          <span className="text-slate-300">:</span>
          <input
            type="text"
            inputMode="numeric"
            value={score2}
            onChange={handleChange(setScore2)}
            disabled={verrouille}
            className="input w-12 text-center font-bold"
            placeholder="-"
          />
        </div>

        <span className="text-left text-sm font-semibold text-slate-800">
          {match.equipe2}
        </span>
      </div>

      {match.lieu && (
        <p className="text-center text-xs text-slate-400">📍 {match.lieu}</p>
      )}

      {!verrouille ? (
        <button
          onClick={handleSave}
          disabled={score1 === '' || score2 === '' || saving}
          className="btn-primary w-full !py-1.5 text-sm"
        >
          {saving ? 'Enregistrement…' : dirty || !prono ? 'Enregistrer mon pronostic' : 'Pronostic enregistré ✓'}
        </button>
      ) : (
        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs">
          <span className="text-slate-500">
            Résultat réel :{' '}
            <span className="font-semibold text-slate-700">
              {match.score1} - {match.score2}
            </span>
          </span>
          {pointsObtenus !== null && (
            <span
              className={`badge ${
                pointsObtenus === 5
                  ? 'bg-amber-100 text-amber-700'
                  : pointsObtenus === 3
                  ? 'bg-try_green-500/10 text-try_green-600'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              +{pointsObtenus} pts
            </span>
          )}
        </div>
      )}
    </div>
  )
}
