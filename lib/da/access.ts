// lib/da/access.ts
import type { AppRole, SecretariatOffice, SecretariatRole } from '@/lib/db/models/User'

interface UserWithDaPermissions {
  role: AppRole
  secretariatRole: SecretariatRole
  office: SecretariatOffice
}

export function canUseDaModule(user: UserWithDaPermissions): boolean {
  if (user.role === 'ADMIN' || user.role === 'LEADERSHIP') {
    return true
  }
  if (
    user.secretariatRole === 'PRESIDENT' ||
    user.secretariatRole === 'SECRETARY_GENERAL' ||
    user.secretariatRole === 'DIRECTOR_GENERAL' ||
    user.secretariatRole === 'TEACHER'
  ) {
    return true
  }
  if (user.secretariatRole === 'USG' && user.office === 'DELEGATION_AFFAIRS') {
    return true
  }
  return false
}
