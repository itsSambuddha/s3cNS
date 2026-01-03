// app/gazette/page.tsx
import { getGazetteIssues } from "@/lib/gazette"
import GazetteClient from "./GazetteClient"

export default function GazettePage() {
  const issues = getGazetteIssues()
  return <GazetteClient issues={issues} />
}
