'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AuthLoader from './AuthLoader'
import { useVendorVerificationDocStatusCheck } from '@/lib/hooks/useVendor'

type VendorVerificationStatus = 'pending' | 'accepted' | 'rejected' | undefined

export default function VerificationGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const {
    data: vendor,
    isLoading,
    isFetched,
  } = useVendorVerificationDocStatusCheck()

  const status: VendorVerificationStatus = vendor?.status

  useEffect(() => {
    if (!isFetched) return

    if (status === 'accepted') {
      router.replace('/vendor/dashboard')
    } else if (status === 'pending' || status === 'rejected' || !status) {
      router.replace('/vendor/verification')
    }
  }, [status, isFetched, router])

  if (isLoading || !isFetched) return <AuthLoader />

  return <>{children}</>
}
