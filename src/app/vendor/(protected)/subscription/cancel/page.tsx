'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function SubscriptionCancelPage() {
  const router = useRouter()

  return (
    <div className='flex flex-col items-center justify-center h-full space-y-4'>
      <h1 className='text-2xl font-semibold'>Subscription Cancelled</h1>
      <p>You can retry subscribing at any time.</p>

      <Button onClick={() => router.push('/vendor/subscription')}>
        View Plans
      </Button>
    </div>
  )
}
