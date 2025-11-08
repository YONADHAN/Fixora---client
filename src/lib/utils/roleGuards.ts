import { UserRolesAllowedForGoogleLogin } from '@/types/user.type'

export function isGoogleLoginAllowed(
  role: string
): role is UserRolesAllowedForGoogleLogin {
  return role === 'customer' || role === 'vendor'
}
