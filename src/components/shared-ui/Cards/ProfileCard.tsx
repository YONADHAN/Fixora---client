'use client'

import React from 'react'
import { Mail, Phone, User, Pencil, MapPin } from 'lucide-react'
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
    <div className='w-full max-w-lg bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 shadow-xl rounded-2xl overflow-hidden transition-all hover:shadow-2xl'>
      {/* Header */}
      <div className='relative bg-gradient-to-r from-slate-800 via-slate-700 to-gray-800 text-white p-6 flex flex-col items-center'>

        <div className='relative group'>
          <div className='relative w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-slate-600 shadow-md flex items-center justify-center bg-gray-100 dark:bg-slate-700'>
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt='Profile'
                fill
                className='object-cover'
              />
            ) : (
              <User className='w-16 h-16 text-gray-500' />
            )}
          </div>
        </div>

        <h1 className='mt-4 text-2xl font-semibold'>{user.name}</h1>
        <p className='text-gray-300 text-sm capitalize'>{user.role}</p>

        <p
          className={`mt-1 text-sm font-medium ${user.status === 'active' ? 'text-green-400' : 'text-red-400'
            }`}
        >
          ● {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </p>

        {/* Edit Button */}
        <button
          onClick={handleEdit}
          className='absolute top-4 right-4 flex items-center gap-1 text-sm font-medium bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-all backdrop-blur-sm'
        >
          <Pencil size={16} />
          Edit
        </button>
      </div>

      {/* Info Section */}
      <div className='p-6 bg-gray-50 dark:bg-slate-800/50 text-gray-700 dark:text-gray-300 space-y-4 text-sm'>
        {/* Email */}
        {user.email && (
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-md bg-gray-100 dark:bg-slate-700'>
              <Mail size={18} className='text-gray-500' />
            </div>
            <span>{user.email}</span>
          </div>
        )}

        {/* Phone */}
        {user.phone && (
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-md bg-gray-100 dark:bg-slate-700'>
              <Phone size={18} className='text-gray-500' />
            </div>
            <span>{user.phone}</span>
          </div>
        )}

        {/* Location */}
        {user.location && (
          <div className='flex items-start gap-3'>
            <div className='p-2 rounded-md bg-gray-100 dark:bg-slate-700 mt-1'>
              <MapPin size={18} className='text-gray-500' />
            </div>
            <div>
              <p className='font-medium'>{user.location.name}</p>
              <p className='text-gray-500 dark:text-gray-400 text-xs'>
                {user.location.displayName}
              </p>
              <p className='text-gray-400 text-xs'>
                ZIP: {user.location.zipCode}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {user.userId && (
        <div className='bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 text-xs px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <User size={14} className='text-gray-400' />
            <span className='font-medium'>User ID:</span>
          </div>
          <span className='text-gray-500'>{user.userId}</span>
        </div>
      )}
    </div>
  )
}

export default ProfileCard
