
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Patrick_Hand } from "next/font/google"
import { Button } from "@/components/ui/button"

const patrickHand = Patrick_Hand({
    weight: "400",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "404 - Page Extinct | s3cNS",
    description: "Whoops! This page went extinct.",
}

export default function NotFound() {
    return (
        // Fixed overlay to cover the navbar and footer
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background p-4 text-center">
            <div className="relative mb-8">
                <Image
                    src="/assets/404/caveman.gif"
                    alt="Confused Caveman"
                    width={800}
                    height={600}
                    className="h-auto w-auto max-w-full"
                    unoptimized
                    priority
                />
            </div>

            <h1 className={`${patrickHand.className} mb-4 text-5xl font-bold tracking-tight text-foreground md:text-6xl text-orange-600`}>
                Whoops! This page went extinct.
            </h1>

            <p className={`${patrickHand.className} mb-8 text-2xl text-muted-foreground md:text-3xl`}>
                We looked everywhere (even under the rocks), but we couldn't find it.
            </p>

            <Button asChild size="lg" className={`${patrickHand.className} text-2xl px-8 py-6`}>
                <Link href="/">
                    Go Back to Cave
                </Link>
            </Button>
        </div>
    )
}
