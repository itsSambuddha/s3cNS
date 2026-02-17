import { Skeleton } from "@/components/ui/skeleton"

export function SeniorSecretariatCarouselSkeleton() {
    return (
        <section className="relative rounded-[2.5rem] border border-blue-200/60 dark:border-white/5 bg-white dark:bg-[#030712]/60 p-8 sm:p-12 shadow-sm overflow-hidden mt-12 mb-12 mx-4 sm:mx-6 lg:mx-8">
            <div className="mx-auto max-w-5xl">
                <header className="mb-16 text-center space-y-6 flex flex-col items-center">
                    <Skeleton className="h-6 w-48 rounded-full" />
                    <div className="space-y-2 flex flex-col items-center w-full">
                        <Skeleton className="h-10 w-3/4 sm:w-1/2" />
                        <Skeleton className="h-6 w-1/3" />
                    </div>
                    <Skeleton className="h-12 w-full max-w-2xl text-center" />
                </header>

                <div className="flex gap-4 overflow-hidden">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-[400px] w-[300px] rounded-3xl flex-shrink-0" />
                    ))}
                </div>
            </div>
        </section>
    )
}
