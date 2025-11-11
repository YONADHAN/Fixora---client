'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

const SuccessfulSection = () => {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6'>
      {/* ✅ Animated success icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
      >
        <CheckCircle2 className='w-16 h-16 text-green-600' />
      </motion.div>

      {/* ✅ Success message */}
      <h2 className='text-2xl font-semibold text-green-700'>
        Documents Verified Successfully!
      </h2>

      <p className='text-gray-600 max-w-md'>
        Your account has been verified by the admin. You can now access your
        vendor dashboard and start managing your business.
      </p>

      {/* ✅ Refresh button */}
      <Button
        onClick={handleRefresh}
        className='mt-4 flex items-center gap-2 bg-green-600 hover:bg-green-700'
      >
        <RefreshCw className='w-4 h-4' />
        Go to Dashboard
      </Button>
    </div>
  )
}

export default SuccessfulSection
