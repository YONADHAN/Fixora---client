'use client'

import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { RootState } from '@/store/store'
import AuthLoader from './AuthLoader'

interface PublicGuardProps {
  children: React.ReactNode
  role: 'admin' | 'vendor' | 'customer'
}
//export default function PublicGuard({ children, role }: PublicGuardProps) {
export default function PublicGuard({ children }: PublicGuardProps) {
  const router = useRouter()

  const { admin } = useSelector((state: RootState) => state.admin)
  const { vendor } = useSelector((state: RootState) => state.vendor)
  const { customer } = useSelector((state: RootState) => state.customer)

  const activeRole = admin
    ? 'admin'
    : vendor
      ? 'vendor'
      : customer
        ? 'customer'
        : null
  const isLoggedIn = Boolean(activeRole)

  useEffect(() => {
    if (isLoggedIn) {
      if (activeRole === 'vendor') {
        const status = vendor?.isVerified?.status

        if (status === 'accepted') {
          router.replace('/vendor/dashboard')
        } else {
          router.replace('/vendor/verification')
        }
      } else {
        router.replace(`/${activeRole}/dashboard`)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, activeRole, router])

  if (isLoggedIn) return <AuthLoader />

  return <>{children}</>
}
