'use client'

import { useParams, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import ServiceWizard from '@/components/shared-ui/forms/service/wizard/serviceWizard'
import { IServiceFormValues } from '@/types/service_feature/service.types'
import { initialServiceFormValues } from '@/components/shared-ui/forms/service/service-form'
import { useGetServicesById, useEditServiceById } from '@/lib/hooks/useService'
import { toast } from 'sonner'

export default function EditServicePage() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params.id as string

  const { data, isLoading } = useGetServicesById({ serviceId })
  const editMutation = useEditServiceById()

  /**
   * Convert API Response → Wizard Initial Values
   */
  const initialValues = useMemo<IServiceFormValues>(() => {
    if (!data) return initialServiceFormValues

    return {
      ...initialServiceFormValues,

      // BASIC INFO
      serviceId: data.serviceId,
      name: data.name,
      description: data.description ?? '',
      subServiceCategoryId: data.subServiceCategoryId,

      // VARIANTS
      serviceVariants: data.serviceVariants ?? [],

      // PRICING
      pricing: {
        pricePerSlot: data.pricing.pricePerSlot,
        advanceAmountPerSlot: data.pricing.advanceAmountPerSlot,
      },

      // SCHEDULE
      schedule: {
        visibilityStartDate: data.schedule.visibilityStartDate,
        visibilityEndDate: data.schedule.visibilityEndDate,

        dailyWorkingWindows:
          data.schedule.dailyWorkingWindows?.length > 0
            ? data.schedule.dailyWorkingWindows
            : [{ startTime: '', endTime: '' }],

        slotDurationMinutes: data.schedule.slotDurationMinutes,

        recurrenceType: data.schedule.recurrenceType,
        weeklyWorkingDays: data.schedule.weeklyWorkingDays ?? [],
        monthlyWorkingDates: data.schedule.monthlyWorkingDates ?? [],

        overrideBlock: data.schedule.overrideBlock ?? [],
        overrideCustom: data.schedule.overrideCustom ?? [],
      },

      // IMAGES (KEEP EMPTY — ONLY FOR NEW UPLOADS)
      images: [],
      mainImage: data.mainImage,
    }
  }, [data])

  /**
   * SUBMIT EDIT (USES SAME PAYLOAD AS CREATE)
   */
  const handleEditService = (values: IServiceFormValues) => {
    // Remove preview-only field
    const { mainImage, ...payloadWithoutPreview } = values

    // Only send real File objects (PATCH-safe)
    const safePayload = {
      ...payloadWithoutPreview,
      images: values.images?.filter((img) => img instanceof File),
    }

    console.log('FINAL PAYLOAD TO API:', safePayload)
    console.log('in json,', JSON.stringify(safePayload))

    editMutation.mutate(
      {
        serviceId,
        payload: safePayload,
      },
      {
        onSuccess: () => {
          toast.success('Service updated successfully')
          router.push('/vendor/service')
        },
        onError: () => {
          toast.error('Failed to update service')
        },
      }
    )
  }

  if (isLoading || !data) {
    return <p className='p-6'>Loading service…</p>
  }

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <div className='flex-1 overflow-hidden'>
        <div className='max-w-5xl mx-auto px-4 py-6'>
          <ServiceWizard
            initialValues={initialValues}
            onSubmit={handleEditService}
          />

          {editMutation.isPending && (
            <div className='fixed inset-0 bg-black/30 flex items-center justify-center z-50'>
              <div className='bg-white px-6 py-3 rounded shadow text-sm font-medium'>
                Updating service...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
