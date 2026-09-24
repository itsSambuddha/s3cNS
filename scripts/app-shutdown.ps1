# PowerShell script wrapper for app shutdown
param(
    [string]$Action = "status",
    [string]$Flag = ""
)

if ($Flag -eq "--notify") {
    npx tsx scripts/toggle-shutdown.ts $Action --notify
} else {
    npx tsx scripts/toggle-shutdown.ts $Action
}
