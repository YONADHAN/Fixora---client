'use client'

import React from 'react'
import { Mail, Phone, User, Pencil, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import type { LocationData } from '@/types/location.type'

interface ProfileUser {
  name: string
  email?: string
  phone?: string
  role: string
  status: string
  profileImage?: string
  location?: LocationData
  userId?: string
}

const ProfileCard = ({ user }: { user: ProfileUser | null }) => {
  const router = useRouter()

  if (!user) return null

  const handleEdit = () => router.push(`/${user.role}/profile/edit`)

  return (
    <div className='w-full max-w-2xl mx-auto relative'>
      <div className='relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-lg rounded-2xl overflow-hidden'>
        
        {/* Cover / Header Area - Professional Neutral */}
        <div className='h-32 bg-slate-100 dark:bg-slate-800/80 border-b border-gray-200 dark:border-slate-800 relative'>
          {/* Edit Button */}
          <button
            onClick={handleEdit}
            className='absolute top-4 right-4 flex items-center gap-2 text-sm font-medium bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg transition-all border border-gray-200 dark:border-slate-700 shadow-sm'
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        </div>

        <div className='px-8 pb-8'>
          {/* Avatar Area */}
          <div className='relative -mt-16 mb-6 flex justify-between items-end'>
            <div className='relative'>
              <div className='w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-slate-900 shadow-sm bg-gray-100 dark:bg-slate-800 relative z-10'>
                {user.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt='Profile'
                    fill
                    className='object-cover'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center bg-gray-50 dark:bg-slate-800'>
                    <User className='w-12 h-12 text-gray-400' />
                  </div>
                )}
              </div>
              <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-[3px] border-white dark:border-slate-900 z-20 flex items-center justify-center ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} title={user.status}>
              </div>
            </div>
          </div>

          {/* User Info Header */}
          <div className='mb-8'>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
              {user.name}
              {user.status === 'active' && (
                <CheckCircle2 className='text-blue-500 w-5 h-5' />
              )}
            </h1>
            <p className='text-gray-500 dark:text-gray-400 font-medium capitalize text-sm mt-1 flex items-center gap-1.5'>
              <ShieldCheck size={16} />
              {user.role}
            </p>
          </div>

          {/* Details Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Email */}
            {user.email && (
              <div className='flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50'>
                <div className='p-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300'>
                  <Mail size={18} />
                </div>
                <div>
                  <p className='text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5 uppercase tracking-wide'>Email</p>
                  <p className='text-gray-900 dark:text-gray-200 font-medium text-sm truncate'>{user.email}</p>
                </div>
              </div>
            )}

            {/* Phone */}
            {user.phone && (
              <div className='flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50'>
                <div className='p-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300'>
                  <Phone size={18} />
                </div>
                <div>
                  <p className='text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5 uppercase tracking-wide'>Phone</p>
                  <p className='text-gray-900 dark:text-gray-200 font-medium text-sm'>{user.phone}</p>
                </div>
              </div>
            )}

            {/* Location */}
            {user.location && (user.location.name || user.location.displayName || user.location.zipCode) && (
              <div className='flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 md:col-span-2'>
                <div className='p-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300'>
                  <MapPin size={18} />
                </div>
                <div className='flex-1'>
                  <p className='text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 uppercase tracking-wide'>Location</p>
                  {user.location.name && <p className='text-gray-900 dark:text-gray-200 font-medium text-sm'>{user.location.name}</p>}
                  {user.location.displayName && (
                    <p className='text-gray-600 dark:text-gray-400 text-sm mt-0.5 line-clamp-2'>
                      {user.location.displayName}
                    </p>
                  )}
                  {user.location.zipCode && (
                    <p className='text-gray-500 dark:text-gray-500 text-sm mt-1'>
                      ZIP: {user.location.zipCode}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
