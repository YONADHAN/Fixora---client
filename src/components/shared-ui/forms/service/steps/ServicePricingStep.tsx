import { useFormikContext, FormikErrors } from 'formik'
import { IServiceFormValues } from '@/types/service_feature/service.types'

export default function ServicePricingStep() {
  const { values, handleChange, errors, touched, setFieldTouched } =
    useFormikContext<IServiceFormValues>()

  const handleTouchedChange =
    (field: 'pricing.pricePerSlot' | 'pricing.advanceAmountPerSlot') =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e)
        setFieldTouched(field, true, true)
      }

  const pricingErrors = errors.pricing as
    | FormikErrors<IServiceFormValues['pricing']>
    | undefined

  return (
    <div className='max-w-2xl mx-auto bg-white dark:bg-card border dark:border-border rounded-2xl shadow-sm p-6 space-y-8'>
      {/* ✅ HEADER */}
      <div>
        <h2 className='text-xl font-semibold text-gray-900 dark:text-foreground'>Service Pricing</h2>
        <p className='text-sm text-gray-500 dark:text-muted-foreground'>
          Define how much the customer pays per booking slot.
        </p>
      </div>

      {/* ✅ PRICING GRID */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* ✅ PRICE PER SLOT */}
        <div className='space-y-1'>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Price per Slot (₹)
          </label>

          <div className='relative'>
            <span className='absolute inset-y-0 left-3 flex items-center text-gray-400'>
              ₹
            </span>
            <input
              type='number'
              name='pricing.pricePerSlot'
              value={values.pricing.pricePerSlot}
              onChange={handleTouchedChange('pricing.pricePerSlot')}
              placeholder='Eg: 500'
              className='w-full pl-8 pr-3 py-2 border dark:border-input rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none bg-transparent dark:bg-background dark:text-foreground'
            />
          </div>

          {touched.pricing?.pricePerSlot && pricingErrors?.pricePerSlot && (
            <p className='text-red-500 text-xs mt-1'>
              {pricingErrors.pricePerSlot}
            </p>
          )}
        </div>

        {/* ✅ ADVANCE AMOUNT */}
        <div className='space-y-1'>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Advance Amount (₹)
          </label>

          <div className='relative'>
            <span className='absolute inset-y-0 left-3 flex items-center text-gray-400'>
              ₹
            </span>
            <input
              type='number'
              name='pricing.advanceAmountPerSlot'
              value={values.pricing.advanceAmountPerSlot}
              onChange={handleTouchedChange('pricing.advanceAmountPerSlot')}
              placeholder='Eg: 100'
              className='w-full pl-8 pr-3 py-2 border dark:border-input rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none bg-transparent dark:bg-background dark:text-foreground'
            />
          </div>

          {touched.pricing?.advanceAmountPerSlot &&
            pricingErrors?.advanceAmountPerSlot && (
              <p className='text-red-500 text-xs mt-1'>
                {pricingErrors.advanceAmountPerSlot}
              </p>
            )}
        </div>
      </div>

      {/* ✅ INFO BANNER */}
      <div className='bg-gray-50 dark:bg-muted border dark:border-border rounded-lg p-4 text-sm text-gray-600 dark:text-muted-foreground'>
        💡 <span className='font-medium'>Tip:</span> The advance amount will be
        collected during booking to confirm the service slot.
      </div>
    </div>
  )
}
