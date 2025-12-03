'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { ServiceFormSection } from '@/components/shared-ui/forms/service/service-form'
import { useGetServicesById, useEditServiceById } from '@/lib/hooks/useService'
import { RequestCreateServiceDTO } from '@/dtos/service_dto'
import { toast } from 'sonner'
import { getAllSubServiceCategories } from '@/services/sub_service_category/sub_service_category'
import { AxiosError } from 'axios'

export default function EditServicePage() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params.id as string

  const { data, isLoading } = useGetServicesById({ serviceId })
  console.log('The data service is : ', data)

  const editMutation = useEditServiceById()

  const [subCategories, setSubCategories] = useState<
    Array<{ subServiceCategoryId: string; name: string }>
  >([])

  useEffect(() => {
    getAllSubServiceCategories({
      page: 1,
      limit: 100,
      search: '',
    }).then((res) => setSubCategories(res.data))
  }, [])

  const initialFormData = useMemo<Partial<RequestCreateServiceDTO>>(() => {
    if (!data) return {}

    return {
      subServiceCategoryId: data.subServiceCategoryId,
      title: data.title,
      description: data.description,

      pricing: {
        pricePerSlot: String(data.pricing.pricePerSlot),
        isAdvanceRequired: data.pricing.isAdvanceRequired ? 'true' : 'false',
        advanceAmountPerSlot: String(data.pricing.advanceAmountPerSlot),
        currency: data.pricing.currency ?? 'INR',
      },

      schedule: {
        visibilityStartDate: data.schedule.visibilityStartDate
          ? data.schedule.visibilityStartDate.toString().slice(0, 10)
          : '',

        visibilityEndDate: data.schedule.visibilityEndDate
          ? data.schedule.visibilityEndDate.toString().slice(0, 10)
          : '',

        workStartTime: data.schedule.workStartTime ?? '',
        workEndTime: data.schedule.workEndTime ?? '',
        slotDurationMinutes: String(data.schedule.slotDurationMinutes ?? ''),

        recurrenceType: data.schedule.recurrenceType ?? '',

        weeklyWorkingDays: data.schedule.weeklyWorkingDays?.join(',') ?? '',

        monthlyWorkingDates: data.schedule.monthlyWorkingDates?.join(',') ?? '',

        holidayDates:
          data.schedule.holidayDates
            ?.map((d) => d.toString().slice(0, 10))
            .join(',') ?? '',
      },

      images: [],
    }
  }, [data])

  const handleSubmit = (values: RequestCreateServiceDTO) => {
    const editPayload = {
      subServiceCategoryId: values.subServiceCategoryId,
      title: values.title,
      description: values.description,

      pricing: {
        pricePerSlot: String(values.pricing.pricePerSlot),
        isAdvanceRequired: values.pricing.isAdvanceRequired,
        advanceAmountPerSlot: String(values.pricing.advanceAmountPerSlot),
        currency: values.pricing.currency ?? 'INR',
      },

      schedule: {
        visibilityStartDate: values.schedule.visibilityStartDate,
        visibilityEndDate: values.schedule.visibilityEndDate,

        workStartTime: values.schedule.workStartTime,
        workEndTime: values.schedule.workEndTime,

        slotDurationMinutes: String(values.schedule.slotDurationMinutes),
        recurrenceType: values.schedule.recurrenceType,

        weeklyWorkingDays: values.schedule.weeklyWorkingDays ?? '',
        monthlyWorkingDates: values.schedule.monthlyWorkingDates ?? '',
        holidayDates: values.schedule.holidayDates ?? '',
      },

      images: values.images,
    }
    editMutation.mutate(
      { serviceId, payload: editPayload },
      {
        onSuccess: () => {
          toast.success('Service updated successfully!')
          router.push('/vendor/service')
        },
        onError: (err: unknown) => {
          if (err instanceof AxiosError)
            toast.error(err?.response?.data?.message ?? 'Update failed.')
        },
      }
    )
  }

  if (isLoading || !data) {
    return <p className='p-6'>Loading service…</p>
  }

  return (
    <div className='max-w-5xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Edit Service</h1>

      <ServiceFormSection
        initialData={initialFormData}
        onSubmit={handleSubmit}
        subCategories={subCategories}
        isLoading={editMutation.isPending}
      />
    </div>
  )
}
