"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { IconSend, IconLoader2, IconCircleCheck, IconAlertCircle } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { sendDeveloperEmail } from "@/app/actions/sendDeveloperEmail";

export default function ContactForm() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [subject, setSubject] = useState("");
    const [prefix, setPrefix] = useState("and I'd like to discuss");
    const [isOpen, setIsOpen] = useState(false);

    const topics = [
        { id: "bug", label: "🐞 Report a Bug", prefix: "and I want to" },
        { id: "feature", label: "💡 Request for a Feature", prefix: "and I have a" },
        { id: "collab", label: "🤝 Collaborate", prefix: "and I'd like to" },
        { id: "hi", label: "👋 Say Hi", prefix: "and I just want to" }
    ];

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus("loading");
        setMessage("");

        const formData = new FormData(event.currentTarget);
        formData.set("subject", subject);

        const result = await sendDeveloperEmail(null, formData);

        if (result?.success) {
            setStatus("success");
            setMessage("Message sent successfully!");
            (event.target as HTMLFormElement).reset();
            setSubject("");
            setPrefix("and I'd like to discuss");
        } else {
            setStatus("error");
            setMessage(result?.message || "Something went wrong.");
        }
    }

    return (
        <div className="bg-slate-50 rounded-[3rem] border border-slate-200 overflow-hidden relative isolate">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-slate-100/50 rounded-full blur-3xl -z-10" />

            <div className="p-8 md:p-12 lg:p-20">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-12">
                        <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest mb-2">Get in Touch</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-12">
                        <div className="text-3xl md:text-5xl font-medium leading-relaxed text-slate-800 tracking-tight relative z-20">
                            <span>Hi, my name is </span>
                            <div className="inline-block border-b-2 border-slate-200 focus-within:border-blue-500 transition-colors mx-2 relative min-w-[200px]">
                                <input
                                    required
                                    name="name"
                                    type="text"
                                    placeholder="your name"
                                    className="w-full bg-transparent border-none p-0 text-slate-900 placeholder:text-slate-300 focus:ring-0 text-3xl md:text-5xl font-bold"
                                />
                            </div>
                            <br className="hidden md:block" />
                            <span> {prefix} </span>

                            {/* Inline Dropdown */}
                            <div className="inline-block relative">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(!isOpen)}
                                    className={cn(
                                        "border-b-2 transition-colors mx-2 text-left min-w-[300px] text-3xl md:text-5xl font-bold focus:outline-none flex items-center justify-between",
                                        subject ? "text-slate-900 border-slate-900" : "text-slate-300 border-slate-200 hover:border-blue-300"
                                    )}
                                >
                                    {subject || "choose a topic"}
                                </button>

                                {isOpen && (
                                    <div className="absolute top-full left-0 mt-4 w-full md:w-[400px] bg-white rounded-3xl shadow-2xl p-4 border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="grid gap-2">
                                            {topics.map((item) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSubject(item.label);
                                                        setPrefix(item.prefix);
                                                        setIsOpen(false);
                                                    }}
                                                    className="text-left px-6 py-4 rounded-2xl hover:bg-slate-50 text-xl font-bold text-slate-700 transition-colors flex items-center gap-3"
                                                >
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <input type="hidden" name="subject" value={subject} required />
                            </div>

                            <span>.</span><br />
                            <span>You can reach me at </span>
                            <div className="inline-block border-b-2 border-slate-200 focus-within:border-blue-500 transition-colors mx-2 relative min-w-[300px]">
                                <input
                                    required
                                    name="email"
                                    type="email"
                                    placeholder="your email"
                                    className="w-full bg-transparent border-none p-0 text-slate-900 placeholder:text-slate-300 focus:ring-0 text-3xl md:text-5xl font-bold"
                                />
                            </div>
                            <span>.</span>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest block">More Details</label>
                            <textarea
                                required
                                name="message"
                                rows={4}
                                placeholder="Tell us more..."
                                className="w-full bg-transparent border-b-2 border-slate-200 text-xl md:text-2xl text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-blue-500 transition-all resize-none leading-relaxed"
                            />
                        </div>

                        <div className="pt-8 flex justify-end">
                            <button
                                disabled={status === "loading"}
                                type="submit"
                                className="px-10 py-5 bg-slate-900 text-white font-bold text-lg rounded-full hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                            >
                                {status === "loading" ? (
                                    <>
                                        <IconLoader2 className="animate-spin" />
                                        Sending...
                                    </>
                                ) : status === "success" ? (
                                    <>
                                        <IconCircleCheck className="text-green-400" />
                                        Sent Successfully
                                    </>
                                ) : status === "error" ? (
                                    <>
                                        <IconAlertCircle className="text-red-400" />
                                        Error
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <IconSend size={20} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
