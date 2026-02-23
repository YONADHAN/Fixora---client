'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateServiceCategory } from '@/lib/hooks/userServiceCategory'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface FormValues {
  name: string
  description: string
  bannerImage: FileList
}

const ServiceAddPage: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<FormValues>()
  const createMutation = useCreateServiceCategory()

  const [preview, setPreview] = useState<string | null>(null)
  const router = useRouter()
  const onSubmit = (data: FormValues) => {
    if (!data.bannerImage || data.bannerImage.length === 0) {
      toast.error('Please upload a banner image')
      return
    }

    const bannerFile = data.bannerImage[0]

    createMutation.mutate(
      {
        name: data.name,
        description: data.description,
        bannerImage: bannerFile,
      },
      {
        onSuccess: () => {
          toast.success('Service category created successfully')
          reset()
          setPreview(null)
          router.push('/admin/dashboard/service_category')
        },
        onError: (err) => {
          toast.error(err?.message || 'Failed to create category')
        },
      }
    )
  }

  const handleImagePreview = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    const file = fileList[0]
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  return (
    <div className='max-w-2xl mx-auto bg-white shadow p-6 rounded-md mt-6'>
      <h2 className='text-2xl font-semibold mb-4'>Add Service Category</h2>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
        {/* Name */}
        <div>
          <label className='block text-sm font-medium mb-1'>
            Category Name
          </label>
          <input
            {...register('name', { required: true })}
            className='w-full border rounded p-2'
            placeholder='Enter category name'
          />
        </div>

        {/* Description */}
        <div>
          <label className='block text-sm font-medium mb-1'>Description</label>
          <textarea
            {...register('description', { required: true })}
            className='w-full border rounded p-2'
            rows={3}
            placeholder='Enter description'
          ></textarea>
        </div>

        {/* Banner Image */}
        <div>
          <label className='block text-sm font-medium mb-1'>
            Banner Image (Required)
          </label>

          <input
            type='file'
            accept='image/*'
            {...register('bannerImage', { required: true })}
            onChange={(e) => handleImagePreview(e.target.files)}
            className='w-full'
          />

          {preview && (
            <img
              src={preview}
              alt='Preview'
              className='mt-3 w-full h-40 object-cover rounded border'
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          className='w-full bg-gray-700 hover:bg-gray-800 text-white py-2 rounded-md'
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? 'Creating...' : 'Add Category'}
        </button>
      </form>
    </div>
  )
}

export default ServiceAddPage
