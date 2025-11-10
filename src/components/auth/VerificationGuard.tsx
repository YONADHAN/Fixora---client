'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AuthLoader from './AuthLoader'
import { useVendorVerificationDocStatusCheck } from '@/lib/hooks/useVendor'
import { AxiosError } from 'axios'

type VendorResponse = {
  status: 'pending' | 'accepted' | 'rejected' | 'blocked'
}

type VendorVerificationStatus = VendorResponse['status'] | undefined

export default function VerificationGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const hasRedirected = useRef(false)

  const {
    data: vendor,
    isLoading,
    isFetched,
    error,
  } = useVendorVerificationDocStatusCheck()

  const status: VendorVerificationStatus = vendor?.status

  // 🧠 type guard for AxiosError
  function isAxiosError(err: unknown): err is AxiosError<{ message?: string }> {
    return (
      typeof err === 'object' &&
      err !== null &&
      'isAxiosError' in err &&
      (err as AxiosError).isAxiosError === true
    )
  }

  const httpStatus = isAxiosError(error) ? error.response?.status : undefined

  const isUnauthorized =
    httpStatus === 401 || httpStatus === 403 || (status as string) === 'blocked'

  useEffect(() => {
    if (!isFetched || hasRedirected.current) return

    if (isUnauthorized) {
      hasRedirected.current = true
      localStorage.clear()
      router.replace('/vendor/signin')
      return
    }

    if (status === 'accepted') {
      hasRedirected.current = true
      router.replace('/vendor/dashboard')
      return
    }

    if (status === 'pending' || status === 'rejected' || !status) {
      hasRedirected.current = true
      router.replace('/vendor/verification')
      return
    }
  }, [isFetched, status, isUnauthorized, router])

  if (isLoading || !isFetched) return <AuthLoader />

  return <>{children}</>
}
