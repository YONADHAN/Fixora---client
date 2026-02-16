

'use client'

import AuthGuard from '@/components/auth/AuthGuard'
import VerificationGuard from '@/components/auth/VerificationGuard'

export default function VendorProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard role='vendor'>
      <VerificationGuard>{children}</VerificationGuard>
    </AuthGuard>
  )
}
