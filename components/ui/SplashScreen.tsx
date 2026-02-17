"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        // Ensure the splash screen stays for at least a small moment to prevent flicker,
        // or until the window load event fires for a "complete" load sensation.

        const handleLoad = () => {
            setTimeout(() => setIsVisible(false), 200) // Minimal artificial delay for "premium" feel
        }

        if (document.readyState === "complete") {
            handleLoad()
        } else {
            window.addEventListener("load", handleLoad)
            return () => window.removeEventListener("load", handleLoad)
        }
    }, [])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white dark:bg-[#030712]"
                >
                    <div className="relative">
                        <div className="h-24 w-24 rounded-full border-4 border-slate-200 dark:border-slate-800" />
                        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Image
                                src="/logo/s3cnsLogo.svg"
                                alt="s3cNS Logo"
                                width={40}
                                height={40}
                                className="animate-pulse object-contain"
                            />
                        </div>
                    </div>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 animate-pulse"
                    >
                        Initializing Workspace...
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
