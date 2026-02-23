'use client'

import React from 'react'
import ProfileCard from '@/components/shared-ui/Cards/ProfileCard'

import { useVendorProfileInfo } from '@/lib/hooks/useVendor'

const VendorProfilePage = () => {
  const { data, isLoading, isError } = useVendorProfileInfo()

  if (isLoading)
    return (
      <div className='min-h-screen flex items-center justify-center text-gray-500 dark:bg-slate-950 dark:text-gray-400'>
        Loading profile...
      </div>
    )

  if (isError)
    return (
      <div className='min-h-screen flex items-center justify-center text-red-500 dark:bg-slate-950'>
        Failed to load profile.
      </div>
    )

  if (!data)
    return (
      <div className='min-h-screen flex items-center justify-center text-gray-400 dark:bg-slate-950'>
        No profile data found.
      </div>
    )
  console.log('The data from backend is ', data.data.data)
  const user = data.data.data

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-6'>
      <ProfileCard user={user} />
    </div>
  )
}

export default VendorProfilePage
