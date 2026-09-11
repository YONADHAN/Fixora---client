'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className='min-h-screen w-full bg-white flex flex-col items-center justify-center p-6 space-y-8'>
      
      <div className='relative w-full max-w-2xl aspect-[16/9]'>
        <Image 
          src="/workers-404-v2.jpg" 
          alt="404 Workers repairing the page" 
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className='text-center space-y-4 max-w-xl'>
        <h1 className='text-4xl md:text-5xl font-extrabold text-slate-900'>
          Page Not Found
        </h1>
        <p className='text-lg md:text-xl text-slate-600'>
          We're working hard to fix it. The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mt-8'>
        <Link href='/admin'>
          <button
            className='flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md hover:shadow-lg'
          >
            <Home className='w-5 h-5' />
            Back to Dashboard
          </button>
        </Link>

        <button
          onClick={() => window.history.back()}
          className='flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-slate-200 text-slate-700 hover:bg-slate-50 transition-all'
        >
          <ArrowLeft className='w-5 h-5' />
          Go Back
        </button>
      </div>
      
    </div>
  )
}
