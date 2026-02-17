import { Skeleton } from "@/components/ui/skeleton"

export function SecmunGlobeSkeleton() {
    return (
        <section className="relative overflow-hidden py-16 md:py-20">
            <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl space-y-3 w-full text-center md:text-left flex flex-col items-center md:items-start">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                </div>

                <div className="relative aspect-square w-full max-w-sm md:max-w-md">
                    <Skeleton className="h-full w-full rounded-full" />
                </div>
            </div>
        </section>
    )
}
