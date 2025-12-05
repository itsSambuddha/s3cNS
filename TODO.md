# TODO: Move User Model to lib/db/models/User.ts

- [x] Create lib/db/models/User.ts with User model definition
- [x] Edit lib/db/models.ts to remove User definition and add re-export from ./models/User
- [x] Update import in lib/auth/getCurrentUser.ts to import User from @/lib/db/models/User
- [x] Update import in lib/attendance/generateSessionsForDate.ts to import User from @/lib/db/models/User
- [x] Update import in app/api/auth/sync/route.ts to import User from @/lib/db/models/User
- [x] Update import in app/api/attendance/session/route.ts to import User from @/lib/db/models/User
- [ ] Verify all changes and ensure no build errors
