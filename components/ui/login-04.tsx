"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { GoogleIcon } from "@/components/icons/GoogleIcon";

export const Login04 = ({
  onEmailSubmitAction,
  onGoogleSubmitAction,
  loading,
  error,
}: {
  onEmailSubmitAction: (values: any) => void;
  onGoogleSubmitAction: () => void;
  loading: boolean;
  error?: string;
}) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onEmailSubmitAction({ email, password });
  };

  return (
    <div className="group/monolith relative w-full overflow-hidden rounded-[2rem] bg-black/40 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl border border-white/10 transition-transform duration-500 hover:shadow-[0_0_80px_-20px_rgba(59,130,246,0.3)]">
      {/* Glare/Rim Lighting Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent opacity-0 mix-blend-overlay transition-opacity duration-700 group-hover/monolith:opacity-100" />
      <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-50 [mask-image:linear-gradient(to_bottom,white,transparent_20%)] pointer-events-none" />

      <div className="relative z-10 form-content-stagger">
        <h2 className="text-3xl font-black tracking-tighter text-white sm:text-4xl form-item">
          Welcome <span className="text-blue-400">Back</span>
        </h2>
        <p className="mt-3 text-sm text-slate-400/80 font-medium tracking-wide form-item">
          Sign in to your account.
        </p>

        {error && (
          <div className="mt-8 rounded-xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20 flex items-start gap-3 form-item backdrop-blur-md">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>{error}</span>
          </div>
        )}

        <form className="mt-10 space-y-8" onSubmit={handleEmailSubmit}>
          <div className="space-y-6">
            <BespokeInput
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
            
            <BespokeInput
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              extraLabel={
                <a href="#" className="text-[10px] font-bold tracking-widest text-blue-400 hover:text-blue-300 transition-colors uppercase">Forgot?</a>
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative h-14 w-full overflow-hidden rounded-xl bg-white/5 font-bold tracking-widest text-white transition-all hover:bg-white/10 active:scale-[0.98] form-item disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Animated Gradient Border using slow conic spin */}
            <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#3b82f6_100%)] opacity-30 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute inset-[1px] rounded-xl bg-black/80 backdrop-blur-xl transition-colors duration-300 group-hover:bg-black/90" />
            
            <span className="relative z-10 flex items-center justify-center gap-2 uppercase text-[11px] sm:text-xs">
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </span>
          </button>

          <div className="relative form-item">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[10px] font-bold tracking-[0.2em] uppercase">
              <span className="bg-[#0a0a0a] px-3 justify-center text-slate-500 rounded-full">Or</span>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onGoogleSubmitAction}
            className="group h-14 w-full rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white shadow-sm transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 backdrop-blur-sm form-item disabled:opacity-50"
          >
            <GoogleIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="font-semibold tracking-wide text-sm">Sign in with Workspace</span>
          </button>
        </form>
        
        <p className="mt-10 text-center text-xs text-slate-500 form-item font-medium">
          Don't have an account?{" "}
          <a href="/signup" className="font-bold text-white hover:text-blue-400 transition-colors uppercase tracking-widest">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

// V3 Bespoke Input: No borders, just an animated underline and floating label feel
const BespokeInput = ({ 
  id, label, type, value, onChange, placeholder, extraLabel 
}: { 
  id: string, label: string, type: string, value: string, onChange: (e: any) => void, placeholder: string, extraLabel?: React.ReactNode 
}) => {
  return (
    <div className="relative flex flex-col form-item group">
      <div className="flex justify-between items-end mb-2">
        <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 transition-colors group-focus-within:text-blue-400">
          {label}
        </label>
        {extraLabel}
      </div>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          required
          placeholder={placeholder}
          className="peer w-full bg-transparent px-0 py-2 text-white placeholder-slate-600 focus:outline-none focus:ring-0 text-lg font-medium tracking-wide"
        />
        {/* Base underline */}
        <div className="absolute bottom-0 left-0 h-[1px] w-full bg-white/10" />
        {/* Animated focus underline */}
        <div className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-blue-500 transition-all duration-300 ease-out peer-focus:w-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
      </div>
    </div>
  )
}
