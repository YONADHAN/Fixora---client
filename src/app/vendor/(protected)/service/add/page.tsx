'use client'

import ServiceWizard from '@/components/shared-ui/forms/service/wizard/serviceWizard'
import { IServiceFormValues } from '@/types/service_feature/service.types'
import { initialServiceFormValues } from '@/components/shared-ui/forms/service/service-form'
import { useCreateService } from '@/lib/hooks/useService'
import { useRouter } from 'next/navigation'
export default function Page() {
  const router = useRouter()
  const { mutate, isPending } = useCreateService()
  const handleCreateService = (values: IServiceFormValues) => {
    mutate(values, {
      onSuccess: () => {
        router.push('/vendor/service')
      },
    })
  }

  return (
    <div className='min-h-screen flex flex-col bg-gray-50 dark:bg-background'>
      <div className='flex-1 overflow-hidden'>
        <div className='max-w-5xl mx-auto px-4 py-6'>
          <ServiceWizard
            initialValues={initialServiceFormValues}
            onSubmit={handleCreateService}
          />

          {isPending && (
            <div className='fixed inset-0 bg-black/30 flex items-center justify-center z-50'>
              <div className='bg-white px-6 py-3 rounded shadow text-sm font-medium'>
                Creating service...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
