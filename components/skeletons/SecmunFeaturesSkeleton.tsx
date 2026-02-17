import { Skeleton } from "@/components/ui/skeleton"

export function SecmunFeaturesSkeleton() {
    return (
        <section className="relative bg-white py-16 dark:bg-[#030712] overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 relative z-10">
                <div className="text-center mb-16 flex flex-col items-center">
                    <Skeleton className="h-8 w-48 rounded-full mb-6" />
                    <Skeleton className="h-12 w-3/4 max-w-4xl mb-6" />
                    <Skeleton className="h-20 w-full max-w-2xl" />
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-6 lg:grid-rows-[auto_auto_auto]">
                    {/* Card 1 */}
                    <div className="col-span-1 lg:col-span-4 lg:row-span-2 p-8 border rounded-3xl h-[500px]">
                        <Skeleton className="h-8 w-48 mb-4" />
                        <Skeleton className="h-16 w-full mb-8" />
                        <Skeleton className="h-full w-full rounded-2xl" />
                    </div>
                    {/* Card 2 */}
                    <div className="col-span-1 lg:col-span-2 lg:row-span-3 p-8 border rounded-3xl h-[800px]">
                        <Skeleton className="h-8 w-full mb-4" />
                        <Skeleton className="h-24 w-full mb-8" />
                        <Skeleton className="h-full w-full rounded-2xl" />
                    </div>
                    {/* Card 3 */}
                    <div className="col-span-1 lg:col-span-4 lg:row-span-1 p-8 border rounded-3xl h-[300px]">
                        <Skeleton className="h-full w-full" />
                    </div>
                    {/* Card 4 & 5 */}
                    <div className="col-span-1 lg:col-span-2 lg:row-span-1 p-8 border rounded-3xl h-[300px]">
                        <Skeleton className="h-full w-full" />
                    </div>
                    <div className="col-span-1 lg:col-span-4 lg:row-span-1 p-8 border rounded-3xl h-[300px]">
                        <Skeleton className="h-full w-full" />
                    </div>
                </div>
            </div>
        </section>
    )
}
