"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
    Calendar,
    ChevronDown,
    ChevronUp,
    Save,
    Clock,
    AlertCircle,
    CalendarDays
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function TimetableMockModule() {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [days, setDays] = useState("3")
    const [startDate, setStartDate] = useState("2024-10-14")

    const handleSave = () => {
        setIsSaving(true)
        // Mock save delay
        setTimeout(() => {
            setIsSaving(false)
            // eslint-disable-next-line
            alert("This is a provisional feature. Timetable configuration is currently in development and changes are not saved.")
        }, 1500)
    }

    return (
        <Card className="overflow-hidden border-orange-200/70 bg-orange-50/30 shadow-sm transition-colors hover:border-orange-300/70">
            <div
                className="cursor-pointer p-4"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100/80 text-orange-600">
                            <CalendarDays className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm font-semibold text-slate-900">Conference Itinerary</h2>
                                <Badge variant="outline" className="border-orange-200 bg-orange-100 text-[10px] font-medium text-orange-700">
                                    Provisional
                                </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                                Configure the schedule, duration, and daily breakdown of the conference.
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="space-y-4 px-4 pb-4 pt-0">
                            <div className="rounded-md border border-orange-200 bg-orange-50 p-3">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="mt-0.5 h-4 w-4 text-orange-600" />
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-orange-800">Feature Under Development</p>
                                        <p className="text-[11px] text-orange-700/80">
                                            This module is currently a placeholder. Start dates and durations are visual only to demonstrate the upcoming itinerary management capabilities.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="days" className="text-xs">Duration (Days)</Label>
                                    <Input
                                        id="days"
                                        type="number"
                                        value={days}
                                        onChange={(e) => setDays(e.target.value)}
                                        className="h-8 text-xs"
                                        min={1}
                                        max={7}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="start-date" className="text-xs">Start Date</Label>
                                    <Input
                                        id="start-date"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="h-8 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Day-wise Breakdown Preview</Label>
                                <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-3">
                                    {Array.from({ length: parseInt(days) || 0 }).map((_, i) => (
                                        <div key={i} className="flex items-center gap-3 rounded border border-slate-100 bg-slate-50/50 p-2 text-xs">
                                            <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">Day {i + 1}</Badge>
                                            <span className="text-slate-500 italic">No events configured</span>
                                        </div>
                                    ))}
                                    {(parseInt(days) || 0) === 0 && (
                                        <p className="text-[11px] text-slate-400 italic">Enter a duration to see slots.</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button
                                    size="sm"
                                    className="h-8 text-xs bg-orange-600 hover:bg-orange-700 text-white"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <Clock className="mr-2 h-3.5 w-3.5 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-3.5 w-3.5" />
                                            Save Configuration
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    )
}
