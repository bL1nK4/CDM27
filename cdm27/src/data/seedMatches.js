// Jeu de données d'exemple pour initialiser la collection Firestore "matches".
// Seuls les 3 matchs du XV de France en phase de poules (poule E) sont
// confirmés publiquement à ce jour (tirage au sort du 3 décembre 2025).
// Les 33 autres matchs de la phase de poules (poules A à F) doivent être
// ajoutés depuis l'espace Admin de l'application au fur et à mesure de leur
// officialisation par World Rugby.
//
// Pour importer ce jeu de données dans Firestore, vous pouvez utiliser le
// script `scripts/seed.js` fourni (voir README.md), ou ajouter les matchs
// manuellement depuis l'espace Admin.

export const seedMatches = [
  {
    poule: 'E',
    equipe1: 'France',
    equipe2: 'États-Unis',
    date: '2027-10-02T09:45:00+02:00',
    lieu: 'Melbourne',
    score1: null,
    score2: null,
    statut: 'a_venir',
  },
  {
    poule: 'E',
    equipe1: 'France',
    equipe2: 'Japon',
    date: '2027-10-09T10:45:00+02:00',
    lieu: 'Brisbane',
    score1: null,
    score2: null,
    statut: 'a_venir',
  },
  {
    poule: 'E',
    equipe1: 'France',
    equipe2: 'Samoa',
    date: '2027-10-17T10:45:00+02:00',
    lieu: 'Sydney',
    score1: null,
    score2: null,
    statut: 'a_venir',
  },
]
