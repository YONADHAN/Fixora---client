'use client'

import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useState } from 'react'
import { useSearchParams, useParams } from 'next/navigation'

export default function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const searchParams = useSearchParams()
  const params = useParams()
  const bookingId = searchParams.get('bookingId')

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!stripe || !elements || loading) return

    setLoading(true)
    setErrorMessage(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/customer/booking/success?bookingId=${bookingId}&holdId=${params.holdId}`,
      },
    })

    if (error) {
      setErrorMessage(error.message ?? 'Payment failed')
    }

    setLoading(false)
  }

  return (
    <div className='mx-auto max-w-5xl px-4 py-10'>
      <h1 className='mb-8 text-2xl font-semibold'>Complete your payment</h1>

      <form onSubmit={handleSubmit} className='grid gap-6 md:grid-cols-2'>
        {/* LEFT — Summary */}
        <div className='rounded-lg border bg-white p-6 shadow-sm'>
          {/* <h2 className='mb-4 text-lg font-medium'>Booking Summary</h2> */}

          {/* <div className='space-y-3 text-sm text-gray-700'>
            <div className='flex justify-between'>
              <span>Service</span>
              <span className='font-medium'>Hair Styling</span>
            </div>

            <div className='flex justify-between'>
              <span>Date</span>
              <span>12 Dec 2025</span>
            </div>

            <div className='flex justify-between'>
              <span>Time</span>
              <span>10:00 – 11:00</span>
            </div>

            <hr />

            <div className='flex justify-between font-semibold'>
              <span>Advance to pay</span>
              <span>₹500</span>
            </div>
          </div> */}

          {/* <p className='mt-4 text-xs text-gray-500'>
            Remaining amount can be paid after service completion.
          </p> */}
        </div>

        {/* RIGHT — Payment */}
        <div className='rounded-lg border bg-white p-6 shadow-sm'>
          <h2 className='mb-4 text-lg font-medium'>Payment Details</h2>

          <PaymentElement />

          {errorMessage && (
            <p className='mt-3 text-sm text-red-600'>{errorMessage}</p>
          )}

          <button
            type='submit'
            disabled={!stripe || loading}
            className='mt-6 w-full rounded bg-black py-2 text-white transition hover:bg-gray-900 disabled:opacity-50'
          >
            {loading ? 'Processing…' : 'Pay Advance'}
          </button>
        </div>
      </form>
    </div>
  )
}
