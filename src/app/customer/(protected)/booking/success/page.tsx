'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const status = searchParams.get('redirect_status')

    if (status === 'succeeded') {
      router.replace('/customer/booking/success')
    }
  }, [])

  return (
    <div className='max-w-md mx-auto p-6 text-center'>
      <h1 className='text-2xl font-semibold'>Payment Successful </h1>
      <p className='mt-2 text-gray-600'>Your booking has been confirmed.</p>
    </div>
  )
}
