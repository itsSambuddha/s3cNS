"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Patrick_Hand } from "next/font/google"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, Footprints, Info } from "lucide-react"

const patrickHand = Patrick_Hand({
    weight: "400",
    subsets: ["latin"],
})

export default function NotFound() {
    const [mounted, setMounted] = useState(false)
    const [clickCount, setClickCount] = useState(0)

    useEffect(() => {
        setMounted(true)
    }, [])

    const bubbles = [
        ["HEY SAM!", "THE GOOGLE IS STUCK", "IN THIS VINE!"],
        ["I'M PULLING AS", "HARD AS I CAN!"],
        ["MAYBE I SHOULD", "RUB MORE ROCKS?"],
        ["PROTOCOL 404:", "VINE DISCONNECTED"],
        ["QUIT POKING ME!", "I'M TRYING TO", "RE-PLUG THE CAVE!"]
    ]

    const currentBubble = bubbles[clickCount % bubbles.length]

    if (!mounted) return null

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col bg-[#020617] overflow-y-auto select-none font-sans px-6 py-12 custom-scrollbar">

            {/* --- ORGANIC AMBIENCE --- */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-cyan-950/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-blue-950/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.02]">
                    <Footprints className="absolute top-10 left-10 text-cyan-500 -rotate-12" size={120} />
                    <Footprints className="absolute bottom-20 right-20 text-blue-500 rotate-45" size={150} />
                </div>
            </div>

            {/* --- MAIN STAGE --- */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-30 flex flex-col items-center justify-center min-h-full max-w-4xl mx-auto w-full gap-8"
            >
                {/* Header: Compact */}
                <div className="text-center space-y-2">
                    <motion.div
                        animate={{ rotate: [-1, 1, -1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className={`${patrickHand.className} inline-flex items-center gap-2 px-3 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm md:text-base rounded-md shadow-sm`}
                    >
                        ⚠️ CAVE ERROR: 404
                    </motion.div>

                    <h1 className={`${patrickHand.className} text-5xl md:text-8xl text-white font-black tracking-tighter leading-none`}>
                        LOST IN <span className="text-cyan-400">HISTORY</span>
                    </h1>
                </div>

                {/* THE STAR: CAVEMAN & SPEECH BUBBLE */}
                <div className="relative group my-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={clickCount}
                            initial={{ scale: 0, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0, opacity: 0, y: 10 }}
                            className="absolute -top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full max-w-[280px] md:max-w-[400px]"
                        >
                            <div className={`${patrickHand.className} bg-white text-slate-900 px-6 py-4 rounded-[2rem] border-[6px] border-cyan-500 text-xl md:text-3xl font-bold shadow-xl relative leading-tight text-center`}>
                                {currentBubble.map((line, i) => (
                                    <div key={i}>{line}</div>
                                ))}
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-t-[20px] border-t-white border-r-[15px] border-r-transparent" />
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* The Workstation (GIF) - Positioned to slightly overlap if needed */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setClickCount(prev => prev + 1)}
                        className="relative p-2 bg-slate-900/40 rounded-[2.5rem] border-4 border-slate-800 shadow-2xl overflow-hidden cursor-pointer"
                    >
                        <Image
                            src="/assets/404/caveman.gif"
                            alt="Prehistoric IT Struggle"
                            width={500}
                            height={375}
                            className={`h-auto w-full max-w-[280px] md:max-w-[420px] rounded-[1.8rem] transition-all duration-300 ${clickCount % 2 === 0 ? 'brightness-90' : 'brightness-110'}`}
                            unoptimized
                            priority
                        />
                        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] rounded-[1.8rem]" />
                    </motion.div>

                    {/* Fun Glow */}
                    <div className="absolute -inset-10 bg-cyan-500/5 blur-[60px] -z-10 rounded-full" />
                </div>

                {/* Funny Copy & Action */}
                <div className="max-w-xl text-center space-y-6">
                    <p className={`${patrickHand.className} text-slate-400 text-xl md:text-3xl px-2 leading-tight`}>
                        "The Secretariat's intern (a confused <span className="text-cyan-400 font-bold">Velociraptor</span>) accidentally ate the fiber-optic vine."
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button asChild size="lg" className={`${patrickHand.className} text-2xl px-12 py-7 bg-cyan-600 hover:bg-cyan-700 hover:scale-105 active:scale-95 shadow-lg rounded-[2rem] h-auto transition-all border-b-[6px] border-cyan-800 active:border-b-0 active:mt-[6px]`}>
                            <Link href="/">
                                Return to Tribe
                            </Link>
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={() => setClickCount(prev => prev + 1)}
                            className={`${patrickHand.className} text-xl text-slate-500 hover:text-cyan-400 hover:bg-transparent flex items-center gap-2`}
                        >
                            <HelpCircle size={20} />
                            Poke the Caveman
                        </Button>
                    </div>

                    {/* Minimalist Footnote */}
                    <div className="flex justify-center items-center gap-6 pt-6 border-t border-white/5 opacity-30">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <Info size={12} /> Secretariat Ops
                        </div>
                        <div className="h-4 w-px bg-slate-800" />
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Stable as a Rock
                        </div>
                    </div>
                </div>
            </motion.div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(6, 182, 212, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(6, 182, 212, 0.4);
                }
            `}</style>
        </div>
    )
}
