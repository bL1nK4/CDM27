// Script optionnel pour importer les matchs de src/data/seedMatches.js
// directement dans Firestore, sans passer par l'interface Admin.
//
// Utilisation :
//   1. npm install firebase-admin
//   2. Téléchargez une clé de compte de service depuis la console Firebase
//      (Paramètres du projet > Comptes de service > Générer une nouvelle clé privée)
//      et enregistrez-la sous le nom serviceAccountKey.json à la racine du projet.
//   3. node scripts/seed.js

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'

const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'))

initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

const seedMatches = [
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

async function seed() {
  const batch = db.batch()
  seedMatches.forEach((match) => {
    const ref = db.collection('matches').doc()
    batch.set(ref, match)
  })
  await batch.commit()
  console.log(`${seedMatches.length} matchs importés avec succès.`)
}

seed().catch((err) => {
  console.error('Erreur lors de l\'import :', err)
  process.exit(1)
})
