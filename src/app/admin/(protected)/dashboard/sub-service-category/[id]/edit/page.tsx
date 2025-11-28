'use client'

import { useParams, useRouter } from 'next/navigation'
import {
  useGetSingleSubServiceCategory,
  useEditSubServiceCategory,
} from '@/lib/hooks/useSubServiceCategory'
import SubServiceCategoryForm, {
  SubServiceCategoryFormValues,
} from '@/components/shared-ui/forms/sub-service-category/sub-service-category-form'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

export default function EditSubServiceCategoryPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()

  const { data, isLoading } = useGetSingleSubServiceCategory(id)
  const editMutation = useEditSubServiceCategory()

  const handleSubmit = (values: SubServiceCategoryFormValues) => {
    if (!data) return

    const formData = new FormData()
    formData.append('subServiceCategoryId', id)
    formData.append('name', values.name)
    formData.append('description', values.description)
    formData.append('serviceCategoryId', values.serviceCategoryId)
    formData.append('serviceCategoryName', values.serviceCategoryName)

    // Add new file only if changed
    if (values.bannerImage) {
      formData.append('SubServiceCategoryImage', values.bannerImage)
    }

    editMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Sub Service Category Updated Successfully!')
        router.push('/admin/dashboard/sub-service-category')
      },
      onError: (err: unknown) => {
        if (err instanceof AxiosError)
          toast.error(err?.response?.data?.message || 'Update failed')
      },
    })
  }

  if (isLoading) return <p className='p-6'>Loading...</p>
  if (!data) return <p className='p-6 text-red-500'>Category not found.</p>

  const item = data

  return (
    <div className='max-w-lg mx-auto p-6'>
      <h2 className='text-2xl font-semibold mb-6'>Edit Sub Service Category</h2>

      <SubServiceCategoryForm
        initialValues={{
          name: item.name,
          description: item.description,
          serviceCategoryId: item.serviceCategoryId,
          serviceCategoryName: item.serviceCategoryName,
          existingImage: item.bannerImage,
        }}
        onSubmit={handleSubmit}
        submitText='Update'
      />
    </div>
  )
}
