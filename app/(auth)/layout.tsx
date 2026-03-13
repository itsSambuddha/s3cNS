import type { ReactNode } from 'react' 

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#020617] text-white selection:bg-white/20">
      {/* 
        AMBIENT BACKGROUND V3
      */}
      
      {/* Animated Glowing Orb */}
      <div 
        className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] animate-slow-spin pointer-events-none opacity-40 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle at center, rgba(37,99,235,0.15) 0%, rgba(14,165,233,0.05) 30%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />
      <div 
        className="absolute -bottom-1/4 -right-1/4 w-[120%] h-[120%] animate-reverse-slow-spin pointer-events-none opacity-30 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle at center, rgba(139,92,246,0.1) 0%, rgba(59,130,246,0.05) 40%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      {/* Grid Lines */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{ 
          backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", 
          backgroundSize: "64px 64px" 
        }}
      />

      {/* Heavy Cinematic Noise */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: NOISE_SVG }}
      />

      {/* Vignette Edge Darkening */}
      <div className="absolute inset-0 bg-black/40 [mask-image:radial-gradient(circle_at_center,transparent_0%,black_100%)] pointer-events-none" />

      {/* Centered Main Content Container */}
      <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8">
        {/* Abstract Top Lighting (Simulating a spotlight above the card) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent blur-[1px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-32 bg-gradient-to-b from-blue-500/10 to-transparent blur-2xl top-light-glow" />

        <div className="w-full max-w-md perspective-container relative flex justify-center">
             {children}
        </div>
        
        {/* Subtle Footer Branding */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-40 hover:opacity-80 transition-opacity duration-500 cursor-default">
            <span className="h-px w-8 bg-white/30" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/70">s3cns OS</span>
            <span className="h-px w-8 bg-white/30" />
        </div>
      </main>

      {/* Global CSS for Animations not in tailwind.config (kept local for ease) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slow-spin { 0% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(180deg) scale(1.1); } 100% { transform: rotate(360deg) scale(1); } }
        @keyframes reverse-slow-spin { 0% { transform: rotate(360deg) scale(1); } 50% { transform: rotate(180deg) scale(1.2); } 100% { transform: rotate(0deg) scale(1); } }
        .animate-slow-spin { animation: slow-spin 60s linear infinite; }
        .animate-reverse-slow-spin { animation: reverse-slow-spin 45s linear infinite; }
        .perspective-container { perspective: 2000px; transform-style: preserve-3d; }
      `}} />
    </div>
  )
}
