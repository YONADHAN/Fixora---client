'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

import {
  useGetSingleServiceCategory,
  useEditServiceCategory,
} from '@/lib/hooks/userServiceCategory'
import { toast } from 'sonner'

export default function EditServiceCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string

  // Fetch the existing category
  const { data, isLoading } = useGetSingleServiceCategory(categoryId)

  // Edit mutation function
  const editMutation = useEditServiceCategory()

  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [bannerImage, setBannerImage] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string>('')

  useEffect(() => {
    if (data) {
      const category = data.data.data
      setName(category.name)
      setDescription(category.description)
      setPreviewImage(category.bannerImage)
    }
  }, [data])

  const handleSubmit = () => {
    editMutation.mutate(
      {
        categoryId,
        name,
        description,
        bannerImage: bannerImage || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Category updated successfully')
          router.push('/admin/dashboard/service_category')
        },
      }
    )
  }

  if (isLoading) {
    return <div className='p-6'>Loading category...</div>
  }

  return (
    <div className='max-w-xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-4'>Edit Service Category</h1>

      {/* Name */}
      <label className='block mb-2 font-semibold'>Name</label>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className='mb-4'
      />

      {/* Description */}
      <label className='block mb-2 font-semibold'>Description</label>
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className='mb-4'
      />

      {/* Banner Image */}
      <label className='block mb-2 font-semibold'>Banner Image</label>

      <input
        type='file'
        accept='image/*'
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            setBannerImage(file)
            setPreviewImage(URL.createObjectURL(file))
          }
        }}
        className='mb-4'
      />

      {/* Preview */}
      {previewImage && (
        <img
          src={previewImage}
          alt='Preview'
          className='w-48 h-32 object-cover rounded mb-4'
        />
      )}

      <Button onClick={handleSubmit} className='w-full'>
        {editMutation.isPending ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  )
}
