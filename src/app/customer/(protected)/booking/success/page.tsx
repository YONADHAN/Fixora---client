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
  }, [router, searchParams])

  return (
    <div className='mx-auto mt-20 max-w-md px-6'>
      <div className='rounded-lg border p-6 text-center'>
        <h1 className='text-xl font-semibold'>Payment completed</h1>

        <p className='mt-2 text-sm text-gray-600'>
          Your advance payment was processed successfully.
        </p>

        <div className='my-6 border-t' />

        <div className='space-y-2 text-sm text-gray-700'>
          <p>Your booking is now confirmed.</p>
          <p>You will receive further details in your booking history.</p>
        </div>

        <p className='mt-6 text-xs text-gray-500'>
          You can safely close this page.
        </p>
      </div>
    </div>
  )
}
