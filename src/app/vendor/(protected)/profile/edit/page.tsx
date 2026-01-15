'use client'

import React from 'react'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { queryClient } from '@/lib/queryClient'

import {
  useVendorProfileInfo,
  useVenderProfileInfoUpdate,
  useVendorUploadProfileImage,
} from '@/lib/hooks/useVendor'
import { EditProfileForm } from '@/components/shared-ui/forms/profile-form/edit-profile-form'
import ProfileUpdatePage from '@/components/shared-ui/forms/profile-form/profile-image-update-form'

const EditVendorProfilePage = () => {
  const router = useRouter()

  const { data, isLoading, isError } = useVendorProfileInfo()

  const { mutate: updateVendorProfile, isPending } =
    useVenderProfileInfoUpdate()

  const { mutate: uploadImage, isPending: isUploadingImage } = useVendorUploadProfileImage()

  const handleSubmit = (formData: any) => {
    const name = formData.name?.trim()
    const phone = formData.phone?.trim()
    const zip = formData.location?.zipCode?.trim()

    if (!name || name.length < 3 || !/^[A-Za-z\s]+$/.test(name)) {
      toast.error(
        'Please enter a valid name (minimum 3 letters, alphabets only).'
      )
      return
    }

    if (!phone || !/^\d{10}$/.test(phone)) {
      toast.error('Please enter a valid 10-digit phone number.')
      return
    }

    if (!zip || !/^\d{6}$/.test(zip)) {
      toast.error('Please enter a valid 6-digit ZIP Code (PIN Code).')
      return
    }

    updateVendorProfile(formData, {
      onSuccess: () => {
        toast.success('Vendor profile updated successfully!')
        queryClient.invalidateQueries({ queryKey: ['vendorProfile'] })
        router.push('/vendor/profile')
      },
      onError: (err) => {
        if (err instanceof AxiosError) {
          toast.error(err.response?.data?.message || 'Something went wrong')
        } else {
          toast.error('Failed to update profile')
        }
      },
    })
  }

  const handleCancel = () => {
    router.push('/vendor/profile')
  }

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center text-gray-500 dark:bg-slate-950 dark:text-gray-400'>
        Loading profile...
      </div>
    )
  }

  if (isError) {
    return (
      <div className='min-h-screen flex items-center justify-center text-red-500 dark:bg-slate-950'>
        Failed to load profile.
      </div>
    )
  }

  if (!data?.data?.data) {
    return (
      <div className='min-h-screen flex items-center justify-center text-gray-400 dark:bg-slate-950'>
        No profile data found.
      </div>
    )
  }

  const vendor = data.data.data



  return (
    <div className='min-h-screen bg-gray-100 dark:bg-slate-950 flex items-center justify-center p-6'>
      <div className='w-full max-w-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden'>
        {/* Header */}
        <div className='bg-gradient-to-r from-slate-800 via-slate-700 to-gray-800 text-white p-6 flex items-center justify-between'>
          <h2 className='text-lg md:text-xl font-semibold tracking-wide'>
            Edit Vendor Profile
          </h2>

          <button
            onClick={handleCancel}
            className='flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all backdrop-blur-sm'
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
        {/* <ProfileUpdatePage role='vendor' /> */}
        {/* Form */}
        <EditProfileForm
          user={vendor}
          role='vendor'
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isPending={isPending}
          onImageUpload={(file) => uploadImage(file, {
            onSuccess: () => {
              toast.success('Profile picture updated!')
              queryClient.invalidateQueries({ queryKey: ['vendorProfile'] })
            },
            onError: (error: any) => {
              toast.error('Failed to upload image')
              console.error(error)
            }
          })}
          isUploadingImage={isUploadingImage}
        />
      </div>
    </div>
  )
}

export default EditVendorProfilePage
