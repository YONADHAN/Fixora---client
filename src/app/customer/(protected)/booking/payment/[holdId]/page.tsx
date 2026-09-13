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
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          <p className="text-muted-foreground text-sm">Loading payment...</p>
        </div>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm bookingSummary={bookingSummary} />
    </Elements>
  )
}
