'use client'

import { ServiceFormSection } from '@/components/shared-ui/forms/service/service-form'
import { useCreateService } from '@/lib/hooks/useService'
import { useGetAllSubServiceCategories } from '@/lib/hooks/useSubServiceCategory'
import { RequestCreateServiceDTO } from '@/dtos/service_dto'
import { useRouter } from 'next/navigation'

export default function AddServicePage() {
  const router = useRouter()
  const { mutateAsync, isPending } = useCreateService()

  // ⭐ Fetch categories here
  const { data, isLoading: isLoadingCategories } =
    useGetAllSubServiceCategories({
      page: 1,
      limit: 100,
      search: '',
    })

  const handleCreate = async (values: RequestCreateServiceDTO) => {
    try {
      await mutateAsync(values)
      router.push('/vendor/services')
    } catch (err) {
      console.error('Service creation failed:', err)
    }
  }

  if (isLoadingCategories) return <p>Loading categories...</p>

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-2xl font-semibold mb-6'>Add New Service</h1>

      <ServiceFormSection
        initialData={{}}
        onSubmit={handleCreate}
        isLoading={isPending}
        subCategories={data?.data || []}
      />
    </div>
  )
}
