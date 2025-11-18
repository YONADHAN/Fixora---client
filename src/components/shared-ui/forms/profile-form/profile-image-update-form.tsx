'use client'

import React, { useState } from 'react'
import ImageCropper from '@/utils/helpers/ImageCropper'
import { useProfileImageUploader } from '@/lib/hooks/useProfileImageUploader'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ProfileUpdatePageProps {
  role: 'vendor' | 'customer'
}

const ProfileUpdatePage: React.FC<ProfileUpdatePageProps> = ({ role }) => {
  const [showCropper, setShowCropper] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null)

  const uploadMutation = useProfileImageUploader(role)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
      setShowCropper(true)
    }
    reader.readAsDataURL(file)
  }

  const handleCropComplete = (file: File) => {
    setSelectedImage(file)
    setCroppedPreview(URL.createObjectURL(file))
    toast.success('Image cropped successfully!')
  }

  const handleUpload = () => {
    if (!selectedImage) {
      toast.error('Please crop an image first!')
      return
    }

    uploadMutation.mutate(selectedImage, {
      onSuccess: () => toast.success('Profile updated!'),
      onError: () => toast.error('Upload failed'),
    })
  }

  return (
    <div className='p-3 max-w-[140px] mx-auto text-center'>
      {croppedPreview ? (
        <img
          src={croppedPreview}
          className='w-20 h-20 rounded-full object-cover border shadow-sm mx-auto'
          alt='Preview'
        />
      ) : (
        <div className='w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 mx-auto'>
          No Image
        </div>
      )}

      <label className='block mt-3 cursor-pointer bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 py-[6px] rounded-md shadow'>
        <input
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          className='hidden'
        />
        Choose
      </label>

      <Button
        className='mt-2 w-full text-xs py-[6px] bg-gray-800 hover:bg-gray-900 text-white'
        onClick={handleUpload}
        disabled={uploadMutation.isPending}
      >
        {uploadMutation.isPending ? '...' : 'Upload'}
      </Button>

      {showCropper && imagePreview && (
        <ImageCropper
          image={imagePreview}
          onCropComplete={handleCropComplete}
          showCropper={setShowCropper}
          aspect={1}
        />
      )}
    </div>
  )
}

export default ProfileUpdatePage
