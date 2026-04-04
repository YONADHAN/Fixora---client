'use client'

import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useState } from 'react'
import { useSearchParams, useParams } from 'next/navigation'

interface BookingSummary {
  serviceName: string
  slots: {
    date: string
    start: string
    end: string
    advancePerSlot: number
    variant?: { name?: string; price?: number }
  }[]
  pricing: {
    totalAmount: number
    advanceAmount: number
    remainingAmount: number
  }
}

interface CheckoutFormProps {
  bookingSummary: BookingSummary | null
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function formatTime(timeStr: string): string {
  try {
    const [h, m] = timeStr.split(':')
    const hour = parseInt(h, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${m} ${ampm}`
  } catch {
    return timeStr
  }
}

export default function CheckoutForm({ bookingSummary }: CheckoutFormProps) {
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
        {/* LEFT — Booking Summary */}
        <div className='rounded-lg border bg-white p-6 shadow-sm'>
          <h2 className='mb-4 text-lg font-medium'>Booking Summary</h2>

          {bookingSummary ? (
            <div className='space-y-4 text-sm text-gray-700'>
              {/* Service name */}
              <div className='flex justify-between'>
                <span className='text-gray-500'>Service</span>
                <span className='font-medium text-gray-900'>{bookingSummary.serviceName}</span>
              </div>

              <hr className='border-gray-100' />

              {/* Slots */}
              <div className='space-y-3'>
                {bookingSummary.slots.map((slot, idx) => (
                  <div key={idx} className='rounded-md bg-gray-50 p-3'>
                    <div className='flex justify-between'>
                      <span className='text-gray-500'>Date</span>
                      <span>{formatDate(slot.date)}</span>
                    </div>
                    <div className='flex justify-between mt-1'>
                      <span className='text-gray-500'>Time</span>
                      <span>{formatTime(slot.start)} – {formatTime(slot.end)}</span>
                    </div>
                    {slot.variant?.name && (
                      <div className='flex justify-between mt-1'>
                        <span className='text-gray-500'>Variant</span>
                        <span>{slot.variant.name}</span>
                      </div>
                    )}
                    <div className='flex justify-between mt-1'>
                      <span className='text-gray-500'>Advance (slot)</span>
                      <span>₹{slot.advancePerSlot}</span>
                    </div>
                  </div>
                ))}
              </div>

              <hr className='border-gray-100' />

              {/* Pricing summary */}
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-gray-500'>Total</span>
                  <span>₹{bookingSummary.pricing.totalAmount}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-500'>Remaining (after service)</span>
                  <span>₹{bookingSummary.pricing.remainingAmount}</span>
                </div>
                <div className='flex justify-between font-semibold text-base pt-1 border-t border-gray-100'>
                  <span>Advance to pay now</span>
                  <span className='text-green-700'>₹{bookingSummary.pricing.advanceAmount}</span>
                </div>
              </div>

              <p className='mt-2 text-xs text-gray-400'>
                The remaining amount can be paid after service completion.
              </p>
            </div>
          ) : (
            <p className='text-sm text-gray-400'>Loading summary…</p>
          )}
        </div>

        {/* RIGHT — Stripe Payment */}
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
            {loading ? 'Processing…' : `Pay ₹${bookingSummary?.pricing.advanceAmount ?? ''} Advance`}
          </button>
        </div>
      </form>
    </div>
  )
}
