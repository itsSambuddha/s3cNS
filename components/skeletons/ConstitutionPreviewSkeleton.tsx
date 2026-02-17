import { Skeleton } from "@/components/ui/skeleton"

export function ConstitutionPreviewSkeleton() {
    return (
        <section className="mx-auto mt-24 max-w-7xl px-6">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/50 p-10 sm:p-14 shadow-sm dark:border-white/5 dark:bg-zinc-900/50">
                <div className="grid gap-16 lg:grid-cols-[1.8fr_1.2fr] items-center">
                    {/* Left Content */}
                    <div className="flex flex-col gap-10">
                        <div className="space-y-6">
                            <Skeleton className="h-8 w-48 rounded-full" />
                            <div className="space-y-4">
                                <Skeleton className="h-12 w-3/4" />
                                <Skeleton className="h-12 w-1/2" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="rounded-2xl border border-slate-200/60 p-5 dark:border-white/5">
                                        <Skeleton className="h-4 w-20 mb-2" />
                                        <Skeleton className="h-6 w-16 mb-1" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Skeleton className="h-14 w-40 rounded-full" />
                            <Skeleton className="h-14 w-60 rounded-full" />
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="hidden lg:block relative">
                        <div className="rounded-[2.5rem] border border-slate-200/80 bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-white/10 space-y-4">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                            <div className="space-y-3">
                                <Skeleton className="h-24 w-full rounded-3xl" />
                                <Skeleton className="h-24 w-full rounded-3xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
