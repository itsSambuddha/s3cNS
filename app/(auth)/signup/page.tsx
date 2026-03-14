// app/signup/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Signup04 } from '@/components/ui/signup-04'
import { signUpWithEmail } from '@/lib/auth/firebase'
import { setSession, syncUser } from '@/lib/auth/utils'
import gsap from 'gsap'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  // GSAP Entrance Animation
  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    
    // 1. Staggered Entrance Animation
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
  }, [])

  const handleSubmit = async (values: {
    name: string
    email: string
    password: string
  }) => {
    setLoading(true)
    setError(null)
    try {
      const user = await signUpWithEmail(values.name, values.email, values.password)
      await syncUser(user)
      const idToken = await user.getIdToken()
      await setSession(idToken)
      router.push('/dashboard')
    } catch (e: any) {
      setError(e?.message || 'Unable to sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div ref={cardRef} className="w-full max-w-lg relative z-20 will-change-transform" style={{ opacity: 0 }}>
      <Signup04
        onSubmitAction={handleSubmit}
        loading={loading}
        error={error ?? undefined}
      />
    </div>
  )
}
