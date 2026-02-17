import Image from "next/image"

export function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-[#030712]">
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
            <p className="mt-8 text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 animate-pulse">
                Initializing Workspace...
            </p>
        </div>
    )
}
