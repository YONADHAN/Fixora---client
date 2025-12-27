'use client'

import AuthGuard from '@/components/auth/AuthGuard'
import { useNotificationsSocket } from '@/lib/hooks/useNotificationsSocket'

export default function ProtectedCustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useNotificationsSocket()
  return <AuthGuard role='customer'>{children}</AuthGuard>
}
