#!/usr/bin/env bash

# ==============================================================================
# s3cNS App Termination & Shutdown Controller
# Simple bash script to hide, show, or broadcast app termination page.
# ==============================================================================

ACTION="${1:-status}"
FLAG="${2:-}"

case "$ACTION" in
  on|enable|activate|show)
    if [ "$FLAG" = "--notify" ]; then
      npx tsx scripts/toggle-shutdown.ts on --notify
    else
      npx tsx scripts/toggle-shutdown.ts on
    fi
    ;;
  off|disable|deactivate|hide)
    npx tsx scripts/toggle-shutdown.ts off
    ;;
  notify)
    npx tsx scripts/toggle-shutdown.ts notify
    ;;
  status)
    npx tsx scripts/toggle-shutdown.ts status
    ;;
  *)
    echo "Usage:"
    echo "  bash scripts/app-shutdown.sh on          (Show termination page & lock app)"
    echo "  bash scripts/app-shutdown.sh off         (Hide termination page & restore app)"
    echo "  bash scripts/app-shutdown.sh notify      (Send termination email & push notification)"
    echo "  bash scripts/app-shutdown.sh on --notify (Lock app AND send notification)"
    echo "  bash scripts/app-shutdown.sh status      (Check termination status)"
    exit 1
    ;;
esac
