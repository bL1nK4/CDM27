import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Configuration Firebase du projet CDM27
const firebaseConfig = {
  apiKey: 'AIzaSyBwZ67hY3uyshd_qfBtOZ1upkPscszZ9Ro',
  authDomain: 'cdm27-ef959.firebaseapp.com',
  projectId: 'cdm27-ef959',
  storageBucket: 'cdm27-ef959.firebasestorage.app',
  messagingSenderId: '63590121444',
  appId: '1:63590121444:web:7b513d7b694d37b673d1f1',
  measurementId: 'G-14PYYN7F0X',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
