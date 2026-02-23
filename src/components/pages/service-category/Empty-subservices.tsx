'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export default function EmptySubServices() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className='h-screen flex flex-col items-center justify-center text-center px-6'>
      {/* Icon */}
      <div className='bg-blue-50 text-blue-600 p-5 rounded-full shadow-sm mb-4'>
        <Home size={42} />
      </div>

      {/* Title */}
      <h2 className='text-2xl font-bold text-gray-800'>Services Coming Soon</h2>

      {/* Subtitle */}
      <p className='text-gray-600 max-w-md mt-2'>
        We’re onboarding trusted professionals for this category. New services
        will be available here shortly.
      </p>

      {/* Button */}
      <Button className='mt-6 px-6' onClick={() => router.push('/')}>
        Go Back Home
      </Button>

      <p className='text-xs text-gray-400 mt-3'>Redirecting in 5 seconds…</p>
    </div>
  )
}
