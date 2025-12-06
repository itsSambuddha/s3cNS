import type { IUser } from '@/lib/db/models/User'

export function applyRolePermissions(user: IUser) {
  if (
    user.secretariatRole === 'PRESIDENT' ||
    user.secretariatRole === 'SECRETARY_GENERAL' ||
    user.secretariatRole === 'DIRECTOR_GENERAL'
  ) {
    user.canManageMembers = true
    user.canApproveUSG = true
    user.canManageFinance = true // Leadership can manage finance
    user.canManageEvents = true // Leadership can manage events
    user.role = 'LEADERSHIP'
  } else if (user.secretariatRole === 'TEACHER') {
    user.canManageMembers = true
    user.canApproveUSG = true
    user.canManageFinance = true // Teachers can manage finance
    user.canManageEvents = true // Teachers can manage events
    user.role = 'TEACHER'
  } else {
    user.canManageMembers = false
    user.canApproveUSG = false
    user.canManageFinance = false
    user.canManageEvents = false
  }

  // Special case for USG Finance
  if (user.secretariatRole === 'USG' && user.office === 'FINANCE') {
    user.canManageFinance = true
  }
}