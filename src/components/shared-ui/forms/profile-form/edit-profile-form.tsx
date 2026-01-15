'use client'

import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { User, Camera, Upload } from 'lucide-react'
import { toast } from 'sonner'

const MapSelector = dynamic(() => import('@/utils/helpers/MapSelector'), {
  ssr: false,
})

// Define proper types
interface Location {
  name: string
  displayName: string
  zipCode: string
}

interface GeoLocation {
  type: string
  coordinates: number[]
}

interface User {
  name: string
  email: string
  phone: string
  location: Location
  geoLocation?: GeoLocation
  profileImage?: string
}

interface FormData {
  name: string
  email: string
  phone: string
  location: Location
  geoLocation?: GeoLocation
}

interface EditProfileFormProps {
  user: User
  role: string
  onSubmit: (formData: FormData) => void
  onCancel: () => void
  isPending: boolean
  onImageUpload: (file: File) => void
  isUploadingImage: boolean
}

export const EditProfileForm = ({
  user,
  onSubmit,
  onCancel,
  isPending,
  onImageUpload,
  isUploadingImage,
}: EditProfileFormProps) => {
  const [mounted, setMounted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<FormData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: {
      name: user?.location?.name || '',
      displayName: user?.location?.displayName || '',
      zipCode: user?.location?.zipCode || '',
    },
    geoLocation: user?.geoLocation || { type: 'Point', coordinates: [] }
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      onImageUpload(file)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name.startsWith('location.')) {
      const key = name.split('.')[1] as keyof Location
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [key]: value },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleLocationSelect = (
    lat: number,
    lng: number,
    name?: string,
    displayName?: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        name: name || 'Selected Location',
        displayName: displayName || `${lat}, ${lng}`,
        zipCode: prev.location.zipCode,
      },
      geoLocation: {
        type: 'Point',
        coordinates: [lng, lat]
      }
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className='p-6 space-y-6 text-gray-700 dark:text-gray-300'>
      {/* Profile Image Upload */}
      <div className="flex flex-col items-center mb-6">
        <div className='relative group cursor-pointer' onClick={handleImageClick}>
          <div className='relative w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-slate-600 shadow-md flex items-center justify-center bg-gray-100 dark:bg-slate-700'>
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt='Profile'
                fill
                className='object-cover'
              />
            ) : (
              <User className='w-16 h-16 text-gray-400' />
            )}

            {/* Overlay */}
            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isUploadingImage ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <Camera className="text-white w-8 h-8" />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 bg-slate-700 text-white p-1.5 rounded-full shadow-lg border-2 border-white dark:border-slate-600">
            <Upload size={14} />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Click to upload new picture</p>
      </div>

      {/* Basic Info */}

      <div>
        <label className='block text-sm font-medium mb-1'>Name</label>
        <input
          type='text'
          name='name'
          value={formData.name}
          onChange={handleChange}
          className='w-full border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-slate-800 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 outline-none'
          required
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-1'>Email</label>
        <input
          type='email'
          name='email'
          value={formData.email}
          disabled
          className='w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/50 rounded-lg px-3 py-2 text-gray-400 dark:text-gray-500 cursor-not-allowed'
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-1'>Phone</label>
        <input
          type='text'
          name='phone'
          value={formData.phone}
          onChange={handleChange}
          className='w-full border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-slate-800 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 outline-none'
        />
      </div>

      {/* Map Integration */}
      <div>
        <label className='block text-sm font-medium mb-2'>
          Select Your Location
        </label>
        {mounted && (
          <div className='h-96 w-full rounded-lg overflow-hidden border dark:border-gray-700'>
            <MapSelector onLocationSelect={handleLocationSelect} />
          </div>
        )}
      </div>

      {/* Optional Zip Field */}
      <div>
        <label className='block text-sm font-medium mb-1'>Zip Code</label>
        <input
          type='text'
          name='location.zipCode'
          value={formData.location.zipCode}
          onChange={handleChange}
          className='w-full border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-slate-800 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 outline-none'
        />
      </div>

      {/* Selected Location Display */}
      <div className='bg-gray-50 dark:bg-slate-800/50 p-3 rounded-lg border dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400'>
        <p>
          <strong>Selected Location:</strong>{' '}
          {formData.location.displayName || 'No location selected'}
        </p>
      </div>

      {/* Buttons */}
      <div className='flex justify-end gap-3 pt-4'>
        <button
          type='button'
          onClick={onCancel}
          className='px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-gray-700 dark:text-gray-200 transition-colors'
          disabled={isPending}
        >
          Cancel
        </button>
        <button
          type='submit'
          disabled={isPending}
          className='px-4 py-2 bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
