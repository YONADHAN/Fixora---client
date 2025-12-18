'use client'

import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/utils/stripe'
import { useEffect, useState } from 'react'
import CheckoutForm from '../../checkoutForm/page'
import { useCreatePaymentIntent } from '@/lib/hooks/usePayment'
import { useParams } from 'next/navigation'

export default function PaymentPage() {
  const params = useParams()
  const holdId = params.holdId as string

  console.log('Hold Id is:', holdId)

  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const { mutateAsync: createPaymentIntent, isPending } =
    useCreatePaymentIntent()

  useEffect(() => {
    if (!holdId) return

    const initPayment = async () => {
      const response = await createPaymentIntent(holdId)
      setClientSecret(response.clientSecret)
    }

    initPayment()
  }, [holdId, createPaymentIntent])

  if (isPending || !clientSecret) {
    return <p>Loading payment…</p>
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  )
}
