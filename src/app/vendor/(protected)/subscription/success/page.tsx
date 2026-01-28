'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function SubscriptionSuccessPage() {
  const router = useRouter()

  return (
    <div className='flex flex-col items-center justify-center h-full space-y-4'>
      <h1 className='text-2xl font-semibold'>Subscription Activated 🎉</h1>
      <p>Your subscription is now active.</p>

      <Button onClick={() => router.push('/vendor/dashboard')}>
        Go to Dashboard
      </Button>
    </div>
  )
}
