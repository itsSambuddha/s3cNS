# Registration Flow Fixes

## Tasks
- [ ] Update app/(public)/register/page.tsx to never call notFound() and pass safe fallback eventType
- [ ] Update components/public/RegisterForm.tsx to accept eventType, avoid .replace on undefined, send correct payload
- [ ] Update app/api/registrations/interest/route.ts to validate fields, resolve Event, create DelegateRegistration, return id
- [ ] Ensure components/da/RegistrationsTab.tsx queries by eventType and displays data
