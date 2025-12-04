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
    <div className='h-screen flex flex-col items-center justify-center text-center px-4'>
      {/* Icon */}
      <div className='bg-blue-100 text-blue-500 p-4 rounded-full mb-4'>
        <Home size={40} />
      </div>

      {/* Text */}
      <h2 className='text-2xl font-semibold'>No Sub-Services Found</h2>
      <p className='text-gray-600 max-w-md mt-2'>
        Currently no sub-services are listed under this category. You will be
        redirected to the homepage shortly.
      </p>

      {/* Button */}
      <Button className='mt-6' onClick={() => router.push('/')}>
        Go Back Home
      </Button>

      <p className='text-xs text-gray-400 mt-2'>Redirecting in 5 seconds…</p>
    </div>
  )
}
