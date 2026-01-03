// app/admin/gazette/new/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Newspaper, UploadCloud } from "lucide-react"

export default function GazetteNewPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successPath, setSuccessPath] = useState<string | null>(null)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    setError(null)
    setSuccessPath(null)
    if (!f) {
      setFile(null)
      return
    }
    if (f.type !== "application/pdf") {
      setError("Only PDF files are allowed.")
      setFile(null)
      return
    }
    setFile(f)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessPath(null)

    if (!file) {
      setError("Select a PDF file first.")
      return
    }

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/admin/gazette/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const text = await res.text()
        console.error("Upload error", res.status, text)
        setError("Upload failed. Check console for details.")
        return
      }

      const data = await res.json()
      setSuccessPath(data.publicPath as string)
      // Optional: refresh Gazette page after short delay
      // setTimeout(() => router.push("/gazette"), 1000)
    } catch (err) {
      console.error("Upload exception", err)
      setError("Unexpected error during upload.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-indigo-700" />
          <div>
            <h1 className="text-xl font-semibold">Upload new Gazette issue</h1>
            <p className="text-xs text-muted-foreground">
              Upload a PDF into the Gazette folder. Metadata like title and theme
              can be refined in the Gazette configuration.
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="border-indigo-200 bg-indigo-50/70 text-[10px] text-indigo-800"
        >
          Publications
        </Badge>
      </div>

      <Card className="max-w-xl border-slate-200/70 bg-white/90 p-4 shadow-sm">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="file" className="text-xs">
              Gazette PDF
            </Label>
            <Input
              id="file"
              type="file"
              accept="application/pdf"
              onChange={onFileChange}
              className="text-xs"
            />
            <p className="text-[11px] text-muted-foreground">
              File will be saved under <code>/public/gazette</code> and picked up
              automatically by the Gazette listing.
            </p>
          </div>

          {file && (
            <p className="text-[11px] text-slate-700">
              Selected: <span className="font-medium">{file.name}</span>
            </p>
          )}

          {error && (
            <p className="text-[11px] text-red-600">
              {error}
            </p>
          )}

          {successPath && (
            <p className="text-[11px] text-emerald-600">
              Uploaded successfully to <code>{successPath}</code>. It should now
              appear in the Gazette list.
            </p>
          )}

          <Button
            type="submit"
            size="sm"
            className="mt-1 inline-flex items-center gap-1 text-xs"
            disabled={isUploading || !file}
          >
            <UploadCloud className="h-3.5 w-3.5" />
            {isUploading ? "Uploading…" : "Upload issue"}
          </Button>
        </form>
      </Card>

      <Card className="max-w-xl border-slate-200/70 bg-slate-50/90 p-3 text-[11px] text-slate-700">
        <p className="font-medium mb-1">Metadata reminder</p>
        <p>
          Titles, subtitles, themes, and reading time are currently managed in{" "}
          <code>lib/gazette.ts</code> via the{" "}
          <code>MANUAL_METADATA</code> map. After uploading, you can add an entry
          there keyed by the exact filename to customize how the issue appears
          in the Gazette UI.
        </p>
      </Card>
    </div>
  )
}

