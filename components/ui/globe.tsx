// components/ui/globe.tsx
'use client'

import { useEffect, useRef } from 'react'
import createGlobe from 'cobe'

type GlobeConfig = {
  autoRotateSpeed: number
  globeColor: string
}

export function World({ globeConfig }: { globeConfig: GlobeConfig }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    let phi = 0

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 800,
      height: 800,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.8,
      mapSamples: 16000,
      mapBrightness: 9,
      // deep blue globe
      baseColor: hexToRgb(globeConfig.globeColor || '#0b1f4b'),
      // bright white dots
      markerColor: [1, 1, 1],
      // stronger rim light
      glowColor: [1, 1, 1],
      markers: [],
      onRender: (state: any) => {
        state.phi = phi
        phi += 0.01 * globeConfig.autoRotateSpeed
      },
    } as any)

    return () => globe.destroy()
  }, [globeConfig])

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
        className="rounded-full"
      />
      {/* spinning soft highlight for extra gradience */}
      <div className="pointer-events-none absolute inset-0 rounded-full mix-blend-screen">
        <div className="animate-[spin_24s_linear_infinite] h-full w-full rounded-full bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.45),transparent_55%)]" />
      </div>
    </div>
  )
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}
