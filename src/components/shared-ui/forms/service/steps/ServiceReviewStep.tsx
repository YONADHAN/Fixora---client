import { useFormikContext } from 'formik'
import { IServiceFormValues } from '@/types/service_feature/service.types'
import { useEffect, useState } from 'react'

export default function ServiceReviewStep() {
  const { values } = useFormikContext<IServiceFormValues>()
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    const file = values.images?.[0]

    if (file instanceof File) {
      const url = URL.createObjectURL(file)
      setImagePreview(url)

      return () => URL.revokeObjectURL(url)
    }

    if (values.mainImage) {
      setImagePreview(values.mainImage)
      return
    }

    setImagePreview(null)
  }, [values.images, values.mainImage])

  return (
    <div className='max-w-4xl mx-auto bg-white dark:bg-card border dark:border-border rounded-2xl shadow-sm p-6 space-y-8'>
      {/* ✅ HEADER */}
      <div>
        <h2 className='text-xl font-semibold text-gray-900 dark:text-foreground'>
          Review & Confirm
        </h2>
        <p className='text-sm text-gray-500 dark:text-muted-foreground'>
          Please verify all details before final submission.
        </p>
      </div>

      {/* ✅ BASIC INFO */}
      <div className='border dark:border-border rounded-xl p-4 space-y-2'>
        <h3 className='font-medium text-gray-800 dark:text-gray-200 mb-2'>Basic Information</h3>

        <p className='text-sm dark:text-gray-300'>
          <b className='dark:text-gray-400'>Service Name:</b> {values.name || '—'}
        </p>

        <p className='text-sm dark:text-gray-300'>
          <b className='dark:text-gray-400'>Description:</b> {values.description || '—'}
        </p>

        <p className='text-sm dark:text-gray-300'>
          <b className='dark:text-gray-400'>Sub Category ID:</b> {values.subServiceCategoryId || '—'}
        </p>
      </div>

      {/* ✅ PRICING */}
      <div className='border dark:border-border rounded-xl p-4 space-y-2'>
        <h3 className='font-medium text-gray-800 dark:text-gray-200 mb-2'>Pricing</h3>

        <p className='text-sm dark:text-gray-300'>
          <b className='dark:text-gray-400'>Price per Slot:</b> ₹{values.pricing?.pricePerSlot ?? 0}
        </p>

        <p className='text-sm dark:text-gray-300'>
          <b className='dark:text-gray-400'>Advance Amount:</b> ₹{values.pricing?.advanceAmountPerSlot ?? 0}
        </p>
      </div>

      {/* ✅ SCHEDULE */}
      <div className='border dark:border-border rounded-xl p-4 space-y-3'>
        <h3 className='font-medium text-gray-800 dark:text-gray-200 mb-2'>Schedule</h3>

        <p className='text-sm dark:text-gray-300'>
          <b className='dark:text-gray-400'>Slot Duration:</b> {values.schedule?.slotDurationMinutes ?? 0} min
        </p>

        <p className='text-sm dark:text-gray-300'>
          <b className='dark:text-gray-400'>Recurrence:</b> {values.schedule?.recurrenceType || '—'}
        </p>

        {/* ✅ DAILY WINDOWS */}
        <div>
          <p className='font-medium text-sm mb-1 dark:text-gray-300'>Daily Working Windows</p>

          {values.schedule?.dailyWorkingWindows?.length > 0 ? (
            <ul className='list-disc ml-5 text-sm space-y-1 dark:text-gray-400'>
              {values.schedule.dailyWorkingWindows.map((w, i) => (
                <li key={i}>
                  {w.startTime} - {w.endTime}
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-sm text-gray-500 dark:text-muted-foreground'>No windows added</p>
          )}
        </div>

        {/* ✅ WEEKLY DAYS */}
        {values.schedule &&
          values.schedule.weeklyWorkingDays &&
          values.schedule?.weeklyWorkingDays?.length > 0 && (
            <p className='text-sm dark:text-gray-300'>
              <b className='dark:text-gray-400'>Weekly Days:</b> {values.schedule.weeklyWorkingDays.join(', ')}
            </p>
          )}

        {/* ✅ MONTHLY DATES */}
        {values.schedule &&
          values.schedule.monthlyWorkingDates &&
          values.schedule?.monthlyWorkingDates?.length > 0 && (
            <p className='text-sm dark:text-gray-300'>
              <b className='dark:text-gray-400'>Monthly Dates:</b>{' '}
              {values.schedule.monthlyWorkingDates.join(', ')}
            </p>
          )}
      </div>

      {/* ✅ VARIANTS */}
      {values.serviceVariants && values.serviceVariants?.length > 0 && (
        <div className='border dark:border-border rounded-xl p-4 space-y-2'>
          <h3 className='font-medium text-gray-800 dark:text-gray-200 mb-2'>Service Variants</h3>

          <div className='space-y-2'>
            {values.serviceVariants.map((v, i) => (
              <div
                key={i}
                className='flex justify-between items-start bg-gray-50 dark:bg-muted p-2 rounded'
              >
                <div>
                  <p className='font-medium text-sm dark:text-foreground'>{v.name}</p>
                  {v.description && (
                    <p className='text-xs text-gray-500 dark:text-muted-foreground'>{v.description}</p>
                  )}
                </div>

                {v.price !== undefined && (
                  <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    ₹{v.price}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ IMAGE PREVIEW */}
      <div className='border dark:border-border rounded-xl p-4 space-y-3'>
        <h3 className='font-medium text-gray-800 dark:text-gray-200'>Main Service Image</h3>

        {imagePreview ? (
          <img
            src={imagePreview}
            alt='Service Preview'
            className='w-64 h-40 object-cover rounded-lg border dark:border-border'
          />
        ) : (
          <p className='text-sm text-red-500'>No image selected</p>
        )}
      </div>
    </div>
  )
}
