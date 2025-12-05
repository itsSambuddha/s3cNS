# TODO: Fix Firebase Import Errors

## Steps to Complete

- [x] Edit `lib/auth/firebase.ts` to add Firebase exports (firebaseAuth and googleProvider)
- [ ] Update import in `hooks/useAuth.ts` to use '@/lib/auth/firebase'
- [ ] Update import in `app/(root)/page.tsx` to use '@/lib/auth/firebase'
- [ ] Update import in `app/(auth)/login/page.tsx` to use '@/lib/auth/firebase'
- [ ] Test the application to ensure import errors are resolved
