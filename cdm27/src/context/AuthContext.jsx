import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null) // objet Firebase Auth
  const [profile, setProfile] = useState(null) // document Firestore users/{uid}
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      if (!firebaseUser) {
        setProfile(null)
        setLoading(false)
      }
    })
    return unsubAuth
  }, [])

  useEffect(() => {
    if (!user) return
    setLoading(true)
    const ref = doc(db, 'users', user.uid)
    const unsubProfile = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setProfile({ uid: user.uid, ...snap.data() })
      }
      setLoading(false)
    })
    return unsubProfile
  }, [user])

  async function inscription(email, motDePasse, pseudo) {
    const cred = await createUserWithEmailAndPassword(auth, email, motDePasse)
    await updateProfile(cred.user, { displayName: pseudo })

    // Le tout premier utilisateur créé devient admin par défaut,
    // pour permettre l'accès initial à l'espace admin.
    const usersSnapCheck = await getDoc(doc(db, 'meta', 'compteurs'))
    const estPremier = !usersSnapCheck.exists()

    await setDoc(doc(db, 'users', cred.user.uid), {
      pseudo,
      email,
      isAdmin: estPremier,
      createdAt: new Date().toISOString(),
    })

    if (estPremier) {
      await setDoc(doc(db, 'meta', 'compteurs'), { premierUtilisateurCree: true })
    }

    return cred.user
  }

  async function connexion(email, motDePasse) {
    const cred = await signInWithEmailAndPassword(auth, email, motDePasse)
    return cred.user
  }

  async function deconnexion() {
    await signOut(auth)
  }

  const value = {
    user,
    profile,
    loading,
    isAdmin: !!profile?.isAdmin,
    inscription,
    connexion,
    deconnexion,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé à l’intérieur de AuthProvider')
  return ctx
}
