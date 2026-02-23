'use client'

import { toast } from 'sonner'
import { useCreateSubServiceCategoryVendor } from '@/lib/hooks/useSubServiceCategory'
import SubServiceCategoryForm, {
  SubServiceCategoryFormValues,
} from '@/components/shared-ui/forms/sub-service-category/sub-service-category-form'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
export default function AddSubCategoryPage() {
  const router = useRouter()
  const mutation = useCreateSubServiceCategoryVendor()

  const handleSubmit = (values: SubServiceCategoryFormValues) => {
    mutation.mutate(
      {
        name: values.name,
        description: values.description,
        bannerImage: values.bannerImage as File,
        serviceCategoryId: values.serviceCategoryId,
        serviceCategoryName: values.serviceCategoryName,
      },
      {
        onSuccess: () => {
          toast.success('Sub service added successfully!')
          router.push('/vendor/sub-service-category')
        },
        onError: (error: unknown) => {
          if (error instanceof AxiosError)
            toast.error(
              error?.response?.data?.message || 'Something went wrong'
            )
        },
      }
    )
  }

  return (
    <div className='max-w-lg mx-auto p-6'>
      <h2 className='text-2xl font-semibold mb-6'>Add Sub Service Category</h2>
      <SubServiceCategoryForm onSubmit={handleSubmit} submitText='Create' />
    </div>
  )
}
