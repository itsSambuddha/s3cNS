"use client";

import React from "react";
import { motion } from "framer-motion";
import { Montserrat } from "next/font/google";
import {
    IconBrandGithub,
    IconBrandX,
    IconMail,
    IconBrandWhatsapp,
    IconBrandInstagram,
    IconBrandLinkedin,
    IconSignature,
    IconQuote,
    IconSchool,
    IconUsersGroup,
    IconAward,
    IconUser,
    IconMessageCircleHeart
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import InteractiveBackground from "@/components/ui/InteractiveBackground";
import ContactForm from "@/components/developer/ContactForm";


const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
    variable: "--font-montserrat",
});

// --- DATA ---
const samBio = "s3cNS was forged in the silence of late-night sprints and refined by the collective feedback of the people on this page. It stands not just as code, but as a shared vision of a digital-first legacy for SECMUN.";

const developers = {
    sam: {
        name: "Sam",
        role: "Lead Developer",
        image: "/images/team/sam.jpg",
        initials: "S",
        socials: [
            { name: "LinkedIn", icon: <IconBrandLinkedin size={20} />, href: "https://www.linkedin.com/in/sam-18d/" },
            { name: "Instagram", icon: <IconBrandInstagram size={20} />, href: "https://instagram.com/_.sam.here._" },
            { name: "WhatsApp", icon: <IconBrandWhatsapp size={20} />, href: "https://wa.me/918837405788" },
            { name: "GitHub", icon: <IconBrandGithub size={20} />, href: "https://github.com/itsSambuddha" },
            // { name: "Twitter", icon: <IconBrandX size={20} />, href: "https://twitter.com/_.sam.here._" },
            { name: "Mail", icon: <IconMail size={20} />, href: "mailto:sidhusamsk@gmail.com" },
        ]
    }
};

const leadership = [
    {
        name: "Sir William B.F. Lynrah",
        role: "Teacher in Charge",
        image: "/images/team/william.jpg",
        initials: "WL",
        message: "Thank you for your guidance and, more importantly, for trusting the vision of a fully digital secretariat. Your belief in this project gave it the green light it needed."
    },
    {
        name: "Naphibansabet Byrsat",
        role: "President",
        image: "/images/team/naphi.jpg",
        initials: "NB",
        message: "A huge shoutout for backing this initiative from day one. Your presence and enthusiasm throughout the development phase were certainly felt."
    }
];

const betaTeam = [
    { name: "Upasana Sarma", initials: "US", image: "/images/team/upasana.jpg" },
    { name: "Souvik Bhattacharjee", initials: "SB", image: "/images/team/souvik.jpg" },
    { name: "Deiname Hynniewta", initials: "DH", image: "/images/team/deiname.jpg" },
    { name: "Addiel Johanan Surong", initials: "AD", image: "/images/team/addiel.jpg" },
];

// --- COMPONENTS ---


const ImagePlaceholder = ({ initials, image, className, landscape = false, large = false, variant = 'bw' }: { initials?: string; image?: string; className?: string; landscape?: boolean; large?: boolean; variant?: 'bw' | 'blue' }) => (
    <div className={cn(
        "bg-slate-50 border border-slate-200 flex items-center justify-center relative overflow-hidden transition-all duration-700 ease-in-out group/img",
        // Only apply global grayscale filter for 'bw' variant. For 'blue', we handle it inside to allow overlay blending.
        variant === 'bw' && "grayscale group-hover/img:grayscale-0",
        landscape ? "aspect-[16/9] w-full rounded-[2.5rem]" : "aspect-[4/5] rounded-[1.8rem]",
        className
    )}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-700 z-10" />
        {image ? (
            <>
                <img
                    src={image}
                    alt={initials || "Team member"}
                    className={cn(
                        "absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105",
                        // For blue variant: use grayscale 
                        variant === 'blue' && "grayscale group-hover/img:grayscale-0"
                    )}
                />
                {/* Blue Tint Overlay using mix-blend-soft-light for a subtle tint */}
                {variant === 'blue' && (
                    <div className="absolute inset-0 bg-blue-500 mix-blend-soft-light opacity-60 group-hover/img:opacity-0 transition-opacity duration-700 z-10 pointer-events-none" />
                )}
            </>
        ) : initials ? (
            <span className={cn(
                "font-black tracking-tighter text-slate-200 transition-colors duration-500",
                large ? "text-8xl md:text-9xl" : "text-4xl md:text-5xl",
                "group-hover/img:text-blue-100/50"
            )}>
                {initials}
            </span>
        ) : (
            <IconUser size={large ? 120 : 48} strokeWidth={1} className="text-slate-100 group-hover/img:text-blue-50 transition-colors" />
        )}
        <div className="absolute inset-0 ring-1 ring-inset ring-slate-900/5 rounded-inherit z-20 pointer-events-none" />
    </div>
);

const EditorialHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="flex flex-col items-center text-center space-y-4 mb-20 relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />

        {subtitle && (
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={cn("text-blue-600 font-bold tracking-[0.5em] text-[10px] uppercase", montserrat.className)}
            >
                {subtitle}
            </motion.p>
        )}

        <div className="relative">
            <h2 className={cn("text-4xl md:text-6xl font-extrabold tracking-tighter uppercase leading-none text-slate-900", montserrat.className)}>
                {title}
            </h2>
            <div className="absolute -bottom-4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600/10 to-transparent" />
        </div>

        <div className="flex items-center gap-4 pt-4">
            <div className="h-px w-8 bg-slate-100" />
            <div className="h-1.5 w-1.5 rounded-full bg-blue-600/20" />
            <div className="h-px w-8 bg-slate-100" />
        </div>
    </div>
);

export default function CreativeAcknowledgementsPage() {
    return (
        <div className="min-h-screen selection:bg-blue-100 selection:text-blue-900 font-sans pb-40 overflow-x-hidden relative isolate">
            {/* --- INTERACTIVE BACKGROUND --- */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <InteractiveBackground />
            </div>

            <main className="max-w-7xl mx-auto px-6 pt-24 md:pt-40">

                {/* --- SECTION 1: THE ARCHITECT --- */}
                <section className="mb-40">
                    <div className="grid lg:grid-cols-12 gap-12 md:gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="lg:col-span-5 group/img"
                        >
                            <div className="relative">
                                <div className="absolute -inset-8 bg-blue-50/50 rounded-full blur-3xl -z-10 group-hover/img:bg-blue-100/50 transition-colors duration-1000" />
                                <ImagePlaceholder variant="blue" large initials={developers.sam.initials} image={developers.sam.image} className="shadow-2xl group-hover/img:-translate-y-4 transition-transform duration-700" />
                                <div className="absolute -bottom-6 -right-6 p-6 md:p-8 bg-white shadow-2xl rounded-[2rem] border border-slate-50 group-hover/img:translate-x-4 transition-transform duration-700 hidden sm:block">
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Technical Lead and Developer</p>
                                    <h3 className={cn("text-3xl font-bold text-slate-900 tracking-tight", montserrat.className)}>SAM</h3>
                                    <p className={cn("text-xs font-medium uppercase tracking-[0.3em] bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500", montserrat.className)}>Secretary General</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="lg:col-span-7 space-y-10"
                        >
                            <div className="space-y-4">
                                {/* <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-lg shadow-sm text-blue-600 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <IconSignature size={12} />
                                    The Acknowledgements
                                </div> */}
                                <h1 className="text-7xl md:text-[10rem] font-black text-slate-900 tracking-tighter leading-[0.8]">
                                    From the<br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700">Dev</span>.
                                </h1>
                            </div>

                            <p className="text-3xl md:text-4xl text-slate-600 font-bold leading-tight max-w-2xl italic">
                                <IconQuote size={32} className="text-blue-100 mb-4" />
                                "{samBio}"
                            </p>

                            <div className="flex flex-wrap gap-4">
                                {developers.sam.socials.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        className="h-12 w-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* --- SECTION 2: UNIFIED LEADERSHIP (SAME LEVEL) --- */}
                <section className="mb-40">
                    <EditorialHeader title="Acknowledgement" subtitle="Special Thanks" />
                    <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-start">
                        {leadership.map((leader, i) => (
                            <motion.div
                                key={leader.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: i * 0.2 }}
                                className="group/img space-y-8"
                            >
                                <div className="relative">
                                    <div className="absolute -inset-4 bg-slate-50 rounded-[2.5rem] -z-10 opacity-0 group-hover/img:opacity-100 transition-opacity" />
                                    <ImagePlaceholder initials={leader.initials} image={leader.image} className="shadow-xl group-hover/img:-translate-y-2 transition-transform duration-700" />
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className={cn("text-3xl font-bold text-slate-900 tracking-tight", montserrat.className)}>{leader.name}</h3>
                                        <p className={cn("text-xs font-medium uppercase tracking-[0.3em] bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500", montserrat.className)}>{leader.role}</p>
                                    </div>
                                    <p className={cn("text-xl text-slate-500 font-medium leading-relaxed italic border-l-4 border-blue-50 pl-6", montserrat.className)}>
                                        "{leader.message}"
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* --- SECTION 3: BETA TEAM (ALL WITH PLACEHOLDERS) --- */}
                <section className="mb-40">
                    <EditorialHeader title="Test Team" subtitle="Systems Verification" />
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        {betaTeam.map((member, i) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group/img space-y-6 text-center sm:text-left"
                            >
                                <ImagePlaceholder initials={member.initials} image={member.image} className="shadow-lg group-hover/img:-translate-y-2 transition-transform duration-700" />
                                <div className="space-y-1">
                                    <h4 className={cn("text-xl font-bold text-slate-900 tracking-tight group-hover/img:text-blue-600 transition-colors", montserrat.className)}>{member.name}</h4>
                                    <p className={cn("text-[10px] font-medium uppercase tracking-widest text-slate-400", montserrat.className)}>Verified Tester</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mt-20 p-10 bg-slate-50/50 rounded-[3rem] border border-slate-100/50 flex flex-col md:flex-row items-center gap-8"
                    >
                        <div className="h-16 w-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-200 shadow-sm shrink-0">
                            <IconUsersGroup size={32} />
                        </div>
                        <p className={cn("text-lg text-slate-500 font-medium leading-relaxed italic max-w-3xl", montserrat.className)}>
                            "A massive thank you to the team who stress-tested the system, and gave their honest feedback that polished the final experience."
                        </p>
                        <div className="ml-auto flex items-center gap-3 text-slate-200">
                            <IconMessageCircleHeart size={20} />
                            <div className="h-px w-12 bg-current" />
                        </div>
                    </motion.div>
                </section>

                {/* --- SECTION 4: ADVISORY BOARD (NO OVERLAP) --- */}
                <section className="mb-40">
                    <EditorialHeader title="Advisory Board" subtitle="Institutional Guidance" />
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="lg:col-span-8 group/img"
                        >
                            <ImagePlaceholder landscape initials="AB" className="shadow-2xl group-hover/img:-translate-y-2 transition-transform duration-700" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-4 space-y-6"
                        >
                            <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 shadow-inner">
                                <IconAward size={40} className="text-blue-200 mb-6" strokeWidth={1.5} />
                                <p className={cn("text-xl text-slate-600 font-bold leading-relaxed italic", montserrat.className)}>
                                    "Extending sincere gratitude to the Advisory Board for their invaluable insights and strategic direction throughout this process."
                                </p>
                            </div>
                            <div className="px-6">
                                <p className={cn("text-[10px] font-medium uppercase tracking-[0.6em] text-slate-300", montserrat.className)}>
                                    Strategic Oversight Unit
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* --- SECTION 5: CONTACT FORM --- */}
                <section className="mb-40">
                    <EditorialHeader title="Contact" subtitle="Get in Touch" />
                    <ContactForm />
                </section>

                {/* --- FOOTER SYMBOLISM & LOGO --- */}
                <footer className="mt-60 flex flex-col items-center space-y-10 text-center relative z-10">
                    <div className="h-px w-40 bg-gradient-to-r from-transparent via-slate-100 to-transparent" />

                    <div className="relative flex items-center justify-center group">
                        {/* Ghost Text */}
                        <div className="space-y-6 opacity-30 group-hover:opacity-50 transition-opacity duration-700">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[1em] mb-4">
                                s3cNS Secretariat archive
                            </p>
                            <h2 className={cn("text-8xl md:text-[15rem] font-black tracking-tighter text-slate-200/50 uppercase pointer-events-none select-none group-hover:text-blue-200/50 transition-colors duration-1000", montserrat.className)}>
                                SECMUN
                            </h2>
                        </div>

                        {/* Club Logo Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pt-10 md:pt-20">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="h-64 w-64 md:h-96 md:w-96 relative"
                            >
                                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <img src="/logo/club-logo.png" alt="Club Logo" className="h-full w-full object-contain relative z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-500 hover:drop-shadow-lg" />
                            </motion.div>
                        </div>
                    </div>

                    <div className="text-[10px] font-bold text-slate-200 uppercase tracking-[0.5em]">
                        St. Edmund&apos;s College // 2025-26
                    </div>
                </footer>

            </main>
        </div>
    );
}
