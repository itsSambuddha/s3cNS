// lib/auth/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from 'firebase/auth'
import { getStorage } from 'firebase/storage'

// Make sure these env vars are set, especially STORAGE_BUCKET = "<project-id>.appspot.com"
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const firebaseAuth = getAuth(app)
export const firebaseStorage = getStorage(app)
export const googleProvider = new GoogleAuthProvider()

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string,
) {
  const userCredential = await createUserWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  )
  const user = userCredential.user
  await updateProfile(user, { displayName: name })
  return user
}

export async function signInWithGoogle() {
  const userCredential = await signInWithPopup(firebaseAuth, googleProvider)
  return userCredential
}
