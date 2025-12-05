// components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t bg-background/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-3 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-sm">
        <p>© {new Date().getFullYear()} s3cNS · SECMUN Platform</p>
        <p className="text-[11px] sm:text-xs">
          Optimized for mobile & PWA‑ready.
        </p>
      </div>
    </footer>
  )
}
