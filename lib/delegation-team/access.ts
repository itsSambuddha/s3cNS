// lib/delegation-team/access.ts
import type { AppRole, SecretariatRole } from '@/lib/db/models/User'

interface UserWithRoles {
  role: AppRole
  secretariatRole: SecretariatRole
}

/**
 * Can the user manage (create/edit/approve) the Delegation Team module?
 * Allowed: President, Secretary General, Director General, Teachers, and Admins.
 */
export function canManageDelegationTeam(user: UserWithRoles): boolean {
  if (user.role === 'ADMIN') return true
  return (
    user.secretariatRole === 'PRESIDENT' ||
    user.secretariatRole === 'SECRETARY_GENERAL' ||
    user.secretariatRole === 'DIRECTOR_GENERAL' ||
    user.secretariatRole === 'TEACHER'
  )
}
