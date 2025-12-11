import { useState } from 'react'
import { useFormikContext, FormikErrors } from 'formik'
import { IServiceFormValues } from '@/types/service_feature/service.types'

export default function ServiceVariantStep() {
  const { values, setFieldValue, errors } =
    useFormikContext<IServiceFormValues>()

  const variantErrors = errors.serviceVariants as
    | FormikErrors<IServiceFormValues['serviceVariants']>
    | undefined

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<string>('')

  const addVariant = () => {
    if (!name.trim()) return

    const existing = values.serviceVariants || []

    const updated = [
      ...existing,
      {
        name: name.trim(),
        description: description.trim() || undefined,
        price: price ? Number(price) : undefined,
      },
    ]

    setFieldValue('serviceVariants', updated, true)

    setName('')
    setDescription('')
    setPrice('')
  }

  const removeVariant = (index: number) => {
    const updated = values.serviceVariants?.filter((_, i) => i !== index) || []
    setFieldValue('serviceVariants', updated, true)
  }

  return (
    <div className='max-w-4xl mx-auto bg-white border rounded-2xl shadow-sm p-6 space-y-8'>
      {/* ✅ HEADER */}
      <div>
        <h2 className='text-xl font-semibold text-gray-900'>
          Service Variants
        </h2>
        <p className='text-sm text-gray-500'>
          Add optional variants or add-ons for your service.
        </p>
      </div>

      {/* ✅ ADD VARIANT FORM */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <label className='block text-sm font-medium mb-1'>Variant Name</label>
          <input
            className='border p-2 rounded-lg w-full'
            placeholder='Eg: Premium Package'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>
            Description (optional)
          </label>
          <input
            className='border p-2 rounded-lg w-full'
            placeholder='Eg: Includes deep cleaning'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>
            Override Slot Price (₹)
          </label>
          <input
            type='number'
            className='border p-2 rounded-lg w-full'
            placeholder='Eg: 200'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>

      <div>
        <button
          type='button'
          onClick={addVariant}
          className='px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition'
        >
          Add Variant
        </button>
      </div>

      {/* ✅ VARIANT LIST */}
      <div className='space-y-3'>
        {values.serviceVariants?.map((v, idx) => (
          <div
            key={`${v.name}-${idx}`}
            className='flex items-center justify-between bg-gray-50 border rounded-lg p-4'
          >
            <div>
              <p className='font-medium text-gray-900'>
                {v.name}{' '}
                {v.price !== undefined && (
                  <span className='text-sm text-gray-500'>(₹{v.price})</span>
                )}
              </p>

              {v.description && (
                <p className='text-sm text-gray-500 mt-1'>{v.description}</p>
              )}
            </div>

            <button
              type='button'
              onClick={() => removeVariant(idx)}
              className='text-xs text-red-600 hover:underline'
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* ✅ ERROR DISPLAY */}
      {typeof variantErrors === 'string' && (
        <p className='text-red-500 text-sm'>{variantErrors}</p>
      )}
      {/* ✅ INFO BANNER */}
      <div className='bg-gray-50 border rounded-lg p-4 text-sm text-gray-600'>
        💡 <span className='font-medium'>Tip:</span> The service variants are
        for adding services similar but having some difference in price.
      </div>
    </div>
  )
}
