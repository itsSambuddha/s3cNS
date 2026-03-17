// lib/auth/permissions.ts

export const SENIOR_SECRETARIAT_ROLES = ["PRESIDENT", "SECRETARY_GENERAL", "DIRECTOR_GENERAL", "TEACHER"]

/**
 * Shared authorization check for admin actions.
 * Allows:
 * - App-level ADMIN role
 * - App-level LEADERSHIP role
 * - App-level TEACHER role
 * - Senior Secretariat Roles (President, SG, DG, Teacher)
 * - Users with explicit canManageMembers flag
 */
export function isAuthorizedAdmin(user: any): boolean {
  if (!user) return false
  if (user.role === "ADMIN") return true
  if (user.role === "LEADERSHIP") return true
  if (user.role === "TEACHER") return true
  if (user.canManageMembers) return true
  if (user.secretariatRole && SENIOR_SECRETARIAT_ROLES.includes(user.secretariatRole)) return true
  return false
}
