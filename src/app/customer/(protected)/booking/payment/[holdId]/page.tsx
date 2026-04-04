'use client'

import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/utils/stripe'
import { useEffect, useState } from 'react'
import CheckoutForm from '../../checkoutForm/page'
import { useCreatePaymentIntent } from '@/lib/hooks/usePayment'
import { useParams } from 'next/navigation'
import { CreatePaymentIntentResponseDTO } from '@/dtos/payment_dto'

export default function PaymentPage() {
  const params = useParams()
  const holdId = params.holdId as string

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [bookingSummary, setBookingSummary] = useState<Omit<CreatePaymentIntentResponseDTO, 'clientSecret'> | null>(null)

  const { mutateAsync: createPaymentIntent, isPending } =
    useCreatePaymentIntent()

  useEffect(() => {
    if (!holdId) return

    const initPayment = async () => {
      const response = await createPaymentIntent(holdId)
      setClientSecret(response.clientSecret)
      setBookingSummary({
        serviceName: response.serviceName,
        slots: response.slots,
        pricing: response.pricing,
      })
    }

    initPayment()
  }, [holdId, createPaymentIntent])

  if (isPending || !clientSecret) {
    return <p>Loading payment…</p>
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm bookingSummary={bookingSummary} />
    </Elements>
  )
}
