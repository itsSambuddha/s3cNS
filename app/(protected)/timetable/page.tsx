"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Coffee, Mic, Award, Users } from "lucide-react"

// --- Mock Data ---

type EventType = "session" | "break" | "ceremony" | "social"

interface Event {
    id: string
    time: string
    title: string
    location: string
    type: EventType
    description?: string
}

const SCHEDULE_DATA: Record<string, Event[]> = {
    "Day 1": [
        {
            id: "d1-1",
            time: "08:00 AM - 09:00 AM",
            title: "Registration & Kit Distribution",
            location: "Main Lobby",
            type: "session",
            description: "Delegates collect their placards and conference kits.",
        },
        {
            id: "d1-2",
            time: "09:30 AM - 11:00 AM",
            title: "Opening Ceremony",
            location: "Auditorium",
            type: "ceremony",
            description: "Welcoming address by the Secretary General and Keynote Speakers.",
        },
        {
            id: "d1-3",
            time: "11:00 AM - 11:30 AM",
            title: "High Tea",
            location: "Cafeteria",
            type: "break",
        },
        {
            id: "d1-4",
            time: "11:30 AM - 01:30 PM",
            title: "Committee Session I",
            location: "Designated Committee Rooms",
            type: "session",
            description: "Setting the agenda and opening speeches.",
        },
        {
            id: "d1-5",
            time: "01:30 PM - 02:30 PM",
            title: "Lunch Break",
            location: "Dining Hall",
            type: "break",
        },
        {
            id: "d1-6",
            time: "02:30 PM - 05:00 PM",
            title: "Committee Session II",
            location: "Designated Committee Rooms",
            type: "session",
            description: "Moderated caucuses and initial lobbying.",
        },
    ],
    "Day 2": [
        {
            id: "d2-1",
            time: "09:00 AM - 12:00 PM",
            title: "Committee Session III",
            location: "Designated Committee Rooms",
            type: "session",
            description: "Drafting resolutions and working papers.",
        },
        {
            id: "d2-2",
            time: "12:00 PM - 01:00 PM",
            title: "Lunch Break",
            location: "Dining Hall",
            type: "break",
        },
        {
            id: "d2-3",
            time: "01:00 PM - 04:00 PM",
            title: "Committee Session IV",
            location: "Designated Committee Rooms",
            type: "session",
            description: "Voting on amendments and final drafts.",
        },
        {
            id: "d2-4",
            time: "06:00 PM - 09:00 PM",
            title: "Delegate Socials",
            location: "City Club / School Grounds",
            type: "social",
            description: "Music, dance, and networking dinner.",
        },
    ],
    "Day 3": [
        {
            id: "d3-1",
            time: "09:30 AM - 12:30 PM",
            title: "Committee Session V",
            location: "Designated Committee Rooms",
            type: "session",
            description: "Final voting and adoption of resolutions.",
        },
        {
            id: "d3-2",
            time: "12:30 PM - 01:30 PM",
            title: "Lunch Break",
            location: "Dining Hall",
            type: "break",
        },
        {
            id: "d3-3",
            time: "02:00 PM - 04:00 PM",
            title: "Closing Ceremony",
            location: "Auditorium",
            type: "ceremony",
            description: "Awards distribution and closing remarks.",
        },
    ],
}

// --- Components ---

const EventIcon = ({ type }: { type: EventType }) => {
    switch (type) {
        case "break":
            return <Coffee className="w-5 h-5 text-orange-500" />
        case "ceremony":
            return <Award className="w-5 h-5 text-purple-500" />
        case "social":
            return <Users className="w-5 h-5 text-pink-500" />
        default:
            return <Mic className="w-5 h-5 text-blue-500" />
    }
}

export default function TimetablePage() {
    const [selectedDay, setSelectedDay] = useState("Day 1")

    return (
        <div className="min-h-screen w-full bg-background relative overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-16 sm:py-24 max-w-5xl">
                {/* Header */}
                <div className="text-center space-y-6 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center"
                    >
                        <Badge
                            variant="outline"
                            className="px-4 py-1.5 text-xs font-bold tracking-widest border-yellow-500/50 text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 uppercase"
                        >
                            Feature Under Development
                        </Badge>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70"
                    >
                        Conference Itinerary
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-lg text-muted-foreground max-w-2xl mx-auto"
                    >
                        Stay updated with the official schedule of events for SECMUN.
                        All timings are subject to change by the Secretariat.
                    </motion.p>
                </div>

                {/* Day Selector */}
                <div className="flex justify-center mb-12">
                    <div className="flex p-1 bg-muted/50 backdrop-blur-sm rounded-full border border-border/50">
                        {Object.keys(SCHEDULE_DATA).map((day) => (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(day)}
                                className={cn(
                                    "relative px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300",
                                    selectedDay === day
                                        ? "text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {selectedDay === day && (
                                    <motion.div
                                        layoutId="activeDay"
                                        className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/25"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{day}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Timeline */}
                <div className="space-y-6 max-w-3xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedDay}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {SCHEDULE_DATA[selectedDay].map((event, index) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative overflow-hidden rounded-2xl border border-border/50 bg-background/50 backdrop-blur-md p-6 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                                >
                                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                                        {/* Time Column */}
                                        <div className="sm:w-32 flex-shrink-0 flex items-center gap-2 text-sm font-semibold text-primary/80">
                                            <Clock className="w-4 h-4" />
                                            {event.time.split(" - ")[0]}
                                        </div>

                                        {/* Content Column */}
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center justify-between gap-4">
                                                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                                    {event.title}
                                                </h3>
                                                <div className="p-2 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors">
                                                    <EventIcon type={event.type} />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="w-4 h-4" />
                                                {event.location}
                                            </div>

                                            {event.description && (
                                                <p className="text-muted-foreground/80 text-sm leading-relaxed pt-2">
                                                    {event.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
