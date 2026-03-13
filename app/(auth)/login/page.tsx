'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from 'firebase/auth'
import { firebaseAuth, googleProvider } from '@/lib/auth/firebase'
import { Login04 } from '@/components/ui/login-04'
import gsap from 'gsap'

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const cardRef = useRef<HTMLDivElement>(null)

  const redirectTo = searchParams.get('from') || '/dashboard'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        router.push(redirectTo)
      } else {
        setCheckingAuth(false)
      }
    })

    return () => unsubscribe()
  }, [router, redirectTo])

  // GSAP Entrance Animation
  useEffect(() => {
    if (checkingAuth || !cardRef.current) return;

    const card = cardRef.current;
    
    // Staggered Entrance Animation
    const ctx = gsap.context(() => {
      // Setup initial state for stagger items
      gsap.set(".form-item", { y: 20, opacity: 0, rotateX: -10 });
      
      const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.2 } });
      
      tl.fromTo(card, 
        { opacity: 0, scale: 0.9, y: 40, rotateX: 15 },
        { opacity: 1, scale: 1, y: 0, rotateX: 0, duration: 1.5, ease: "power4.out" }
      )
      .to(".form-item", {
        y: 0,
        opacity: 1,
        rotateX: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out"
      }, "-=1.0"); // Overlap with main card entrance
    }, card);

    return () => {
      ctx.revert();
    };
  }, [checkingAuth])

  const setAuthCookieAndRedirect = async () => {
    const user = firebaseAuth.currentUser
    if (!user) return

    const idToken = await user.getIdToken(true)

    const res = await fetch('/api/auth/set-cookie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Failed to establish session')
    }

    router.push(redirectTo)
  }

  const handleEmailSubmit = async (values: { email: string; password: string }) => {
    setLoading(true)
    setError(null)
    try {
      await signInWithEmailAndPassword(firebaseAuth, values.email, values.password)
      await setAuthCookieAndRedirect()
    } catch (e: any) {
      setError(e?.message || 'Unable to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      await signInWithPopup(firebaseAuth, googleProvider)
      await setAuthCookieAndRedirect()
    } catch (e: any) {
      setError(e?.message || 'Unable to sign in with Google')
    } finally {
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="flex flex-col items-center justify-center p-8 z-20">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full border border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent animate-spin shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
          <div className="absolute inset-3 rounded-full border border-blue-400/30 border-b-transparent animate-[spin_2s_linear_infinite_reverse]" />
        </div>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 animate-pulse">Initializing Interface...</p>
      </div>
    )
  }

  return (
    <div ref={cardRef} className="w-full max-w-lg relative z-20 will-change-transform" style={{ opacity: 0 }}>
      <Login04
        onEmailSubmitAction={handleEmailSubmit}
        onGoogleSubmitAction={handleGoogleSubmit}
        loading={loading}
        error={error ?? undefined}
      />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center p-8">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        </div>
        <p className="mt-6 text-sm font-medium text-slate-500 tracking-wide">Loading workspace...</p>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}
