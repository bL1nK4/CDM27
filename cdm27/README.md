# CDM27 — Pronostics Coupe du Monde de Rugby 2027

Application de pronostics entre collègues/amis pour la Coupe du Monde de Rugby 2027, construite avec **React (Vite)**, **Firebase** (Auth + Firestore) et **Tailwind CSS**.

## Fonctionnalités

- Connexion / inscription par email + pseudonyme (Firebase Auth)
- Saisie des pronostics match par match, filtrables par poule
- Classement général en temps réel : **3 points** pour le bon vainqueur (ou match nul), **5 points** pour le score exact
- Espace Admin protégé : ajout des matchs et saisie des résultats réels

## Démarrage rapide

```bash
npm install
npm run dev
```

L'application démarre sur `http://localhost:5173`.

## Configuration Firebase

La configuration Firebase est déjà renseignée dans `src/firebase.js` (projet `cdm27-ef959`). Deux choses à activer côté console Firebase avant le premier lancement :

1. **Authentication** → Sign-in method → activer **Email/Password**.
2. **Firestore Database** → créer la base (mode production), puis déployer les règles du fichier `firestore.rules` fourni (copier-coller dans l'onglet "Règles" de la console, ou via `firebase deploy --only firestore:rules` si vous utilisez la CLI Firebase).

## Devenir administrateur

Le **tout premier compte créé** sur l'application devient automatiquement administrateur (voir `AuthContext.jsx`). Pour ajouter d'autres administrateurs par la suite, modifiez manuellement le champ `isAdmin` à `true` sur le document correspondant dans `Firestore > users > {uid}` depuis la console Firebase (les règles de sécurité empêchent un utilisateur de se l'auto-attribuer côté client).

⚠️ Cette logique "premier arrivé = admin" est pensée pour un usage simple entre proches/collègues. Pour un usage plus large, pensez à créer le compte admin en premier et/ou à gérer les droits directement depuis la console.

## Données des matchs

La composition complète des poules et le calendrier des 36 matchs de la Coupe du Monde 2027 n'étaient pas encore intégralement officialisés au moment de la génération de ce projet. Seuls les 3 matchs du XV de France (poule E) sont préremplis à titre d'exemple dans `src/data/seedMatches.js`.

Deux façons d'ajouter les matchs restants :

1. **Depuis l'application** : connectez-vous en tant qu'admin, rendez-vous sur `/admin`, et ajoutez chaque match (poule, équipes, date, lieu) via le formulaire.
2. **Import en masse** : complétez `src/data/seedMatches.js` puis exécutez le script `scripts/seed.js` (voir les instructions en tête du fichier — nécessite une clé de compte de service Firebase).

## Structure du projet

```
src/
  firebase.js            Initialisation Firebase (Auth + Firestore)
  context/AuthContext.jsx Fournisseur d'authentification (connexion, inscription, profil)
  components/
    Navbar.jsx            Barre de navigation
    MatchCard.jsx          Carte de pronostic pour un match
  pages/
    Login.jsx              Connexion / inscription
    Pronostics.jsx          Saisie des pronostics
    Classement.jsx          Classement général
    Admin.jsx               Gestion des matchs et résultats (protégée)
  utils/points.js          Calcul des points (3 / 5)
  data/seedMatches.js       Jeu de données d'exemple
firestore.rules            Règles de sécurité Firestore
scripts/seed.js            Script d'import en masse (optionnel)
```

## Modèle de données Firestore

- `users/{uid}` → `{ pseudo, email, isAdmin, createdAt }`
- `matches/{id}` → `{ poule, equipe1, equipe2, date, lieu, score1, score2, statut }` (`statut` : `a_venir` | `termine`)
- `pronostics/{uid}_{matchId}` → `{ uid, matchId, score1, score2, updatedAt }`

## Déploiement

Le build de production se génère avec :

```bash
npm run build
```

Le dossier `dist/` peut ensuite être déployé sur **Firebase Hosting**, **Vercel** ou **Netlify**. Pour Firebase Hosting :

```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # choisir "dist" comme dossier public, SPA: oui
firebase deploy
```
