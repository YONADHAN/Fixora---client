'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className='min-h-screen w-full bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-6 space-y-8 transition-colors duration-300'>
      
      <div className='relative w-full max-w-2xl aspect-[16/9]'>
        <Image 
          src="/workers-404-v2.png" 
          alt="404 Workers repairing the page" 
          fill
          className="object-contain drop-shadow-xl dark:opacity-90 transition-opacity"
          priority
        />
      </div>

      <div className='text-center space-y-4 max-w-xl'>
        <h1 className='text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
          Page Not Found
        </h1>
        <p className='text-lg md:text-xl text-slate-600 dark:text-slate-400'>
          We're working hard to fix it. The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mt-8'>
        <Link href='/'>
          <button
            className='group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white transition-all shadow-md hover:shadow-lg active:scale-95'
          >
            <Home className='w-5 h-5 transition-transform group-hover:-translate-y-1' />
            Back to Homepage
          </button>
        </Link>

        <button
          onClick={() => window.history.back()}
          className='group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all active:scale-95'
        >
          <ArrowLeft className='w-5 h-5 transition-transform group-hover:-translate-x-1' />
          Go Back
        </button>
      </div>
      
    </div>
  )
}
