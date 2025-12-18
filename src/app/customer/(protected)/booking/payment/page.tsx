'use client'

import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/stripe'
import { useEffect, useState } from 'react'
import CheckoutForm from './CheckoutForm'
import axios from '@/lib/axios'

export default function PaymentPage({ searchParams }: any) {
  const { holdId } = searchParams
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    if (!holdId) return

    axios
      .post(`/customer/booking/booking-holds/${holdId}/payment-intent`)
      .then((res) => {
        setClientSecret(res.data.data.clientSecret)
      })
  }, [holdId])

  if (!clientSecret) return <p>Loading payment…</p>

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  )
}
