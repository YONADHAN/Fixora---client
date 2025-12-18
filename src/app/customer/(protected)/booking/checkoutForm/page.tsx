'use client'

import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useState } from 'react'

export default function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/customer/booking/success`,
      },
    })

    if (error) {
      setErrorMessage(error.message || 'Payment failed')
      setLoading(false)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <PaymentElement />
      {errorMessage && <p className='text-sm text-red-600'>{errorMessage}</p>}
      <button
        disabled={!stripe || loading}
        className='w-full bg-black text-white py-2 rounded'
      >
        {loading ? 'Processing…' : 'Pay Advance'}
      </button>
    </form>
  )
}
