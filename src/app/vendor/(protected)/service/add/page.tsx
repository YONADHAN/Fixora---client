'use client'

import { ServiceFormSection } from '@/components/shared-ui/forms/service/service-form'
import { useCreateService } from '@/lib/hooks/useService'
import { useGetAllSubServiceCategories } from '@/lib/hooks/useSubServiceCategory'
import { RequestCreateServiceDTO } from '@/dtos/service_dto'
import { useRouter } from 'next/navigation'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

export default function AddServicePage() {
  const router = useRouter()
  const { mutateAsync, isPending } = useCreateService()

  const { data, isLoading: isLoadingCategories } =
    useGetAllSubServiceCategories({
      page: 1,
      limit: 100,
      search: '',
    })

  // const handleCreate = async (values: RequestCreateServiceDTO) => {
  //   console.log('Handle create function in the parent worked', values)
  //   try {
  //     await mutateAsync(values)
  //     router.push('/vendor/services')
  //   } catch (err) {
  //     console.error('Service creation failed:', err)
  //     if (err instanceof AxiosError) {
  //       const error = JSON.stringify(err)
  //       console.log(error)
  //     }
  //   }
  // }
  const handleCreate = async (values: RequestCreateServiceDTO) => {
    const fd = new FormData()

    fd.append('subServiceCategoryId', values.subServiceCategoryId)
    fd.append('title', values.title)
    fd.append('description', values.description)

    fd.append('pricing[pricePerSlot]', values.pricing.pricePerSlot)
    fd.append('pricing[isAdvanceRequired]', values.pricing.isAdvanceRequired)
    fd.append(
      'pricing[advanceAmountPerSlot]',
      values.pricing.advanceAmountPerSlot
    )

    if (values.pricing.currency) {
      fd.append('pricing[currency]', values.pricing.currency)
    }

    fd.append('isActiveStatusByVendor', values.isActiveStatusByVendor)
    if (values.isActiveStatusByAdmin)
      fd.append('isActiveStatusByAdmin', values.isActiveStatusByAdmin)
    if (values.adminStatusNote)
      fd.append('adminStatusNote', values.adminStatusNote)

    const s = values.schedule
    fd.append('schedule[visibilityStartDate]', s.visibilityStartDate)
    fd.append('schedule[visibilityEndDate]', s.visibilityEndDate)
    fd.append('schedule[workStartTime]', s.workStartTime)
    fd.append('schedule[workEndTime]', s.workEndTime)
    fd.append('schedule[slotDurationMinutes]', s.slotDurationMinutes)
    fd.append('schedule[recurrenceType]', s.recurrenceType)

    if (s.weeklyWorkingDays)
      fd.append('schedule[weeklyWorkingDays]', s.weeklyWorkingDays)
    if (s.monthlyWorkingDates)
      fd.append('schedule[monthlyWorkingDates]', s.monthlyWorkingDates)
    if (s.holidayDates) fd.append('schedule[holidayDates]', s.holidayDates)

    values.images.forEach((file) => fd.append('images', file))

    try {
      await mutateAsync(fd)
      router.push('/vendor/services')
    } catch (err: unknown) {
      console.error(err)
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message)
      }
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
