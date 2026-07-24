/**
 * Calcule les points d'un pronostic par rapport au résultat réel d'un match.
 * Règles :
 *  - 5 points si le score exact est trouvé (les deux scores identiques)
 *  - 3 points si seul le bon vainqueur (ou match nul) est trouvé
 *  - 0 point sinon
 *
 * @param {number} predScore1 - score pronostiqué équipe 1
 * @param {number} predScore2 - score pronostiqué équipe 2
 * @param {number} realScore1 - score réel équipe 1
 * @param {number} realScore2 - score réel équipe 2
 * @returns {number} points obtenus (0, 3 ou 5)
 */
export function calculatePoints(predScore1, predScore2, realScore1, realScore2) {
  if (
    predScore1 === null ||
    predScore1 === undefined ||
    predScore2 === null ||
    predScore2 === undefined ||
    realScore1 === null ||
    realScore1 === undefined ||
    realScore2 === null ||
    realScore2 === undefined
  ) {
    return 0
  }

  const p1 = Number(predScore1)
  const p2 = Number(predScore2)
  const r1 = Number(realScore1)
  const r2 = Number(realScore2)

  // Score exact
  if (p1 === r1 && p2 === r2) return 5

  // Bon résultat (vainqueur identique ou nul identique)
  const predResult = Math.sign(p1 - p2) // 1: équipe1 gagne, -1: équipe2 gagne, 0: nul
  const realResult = Math.sign(r1 - r2)
  if (predResult === realResult) return 3

  return 0
}

/**
 * Détermine un libellé de résultat lisible ("Vainqueur", "Nul") à partir de deux scores.
 */
export function resultLabel(score1, score2, team1, team2) {
  if (score1 === score2) return 'Match nul'
  return score1 > score2 ? team1 : team2
}
