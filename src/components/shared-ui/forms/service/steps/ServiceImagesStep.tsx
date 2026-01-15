import { useFormikContext } from 'formik'
import { IServiceFormValues } from '@/types/service_feature/service.types'
import { useEffect, useState } from 'react'

export default function ServiceImagesStep() {
  const { values, setFieldValue, touched, errors } =
    useFormikContext<IServiceFormValues>()

  const [preview, setPreview] = useState<string | null>(null)

  /**
   * ✅ PREVIEW LOGIC
   * Priority:
   * 1. New uploaded File (values.images[0])
   * 2. Existing image from API (values.mainImage)
   * 3. Nothing
   */
  useEffect(() => {
    const file = values.images?.[0]

    // ✅ 1. If new file selected → preview it
    if (file instanceof File) {
      const url = URL.createObjectURL(file)
      setPreview(url)

      return () => URL.revokeObjectURL(url)
    }

    // ✅ 2. If no new file → show existing mainImage (EDIT MODE)
    if (values.mainImage) {
      setPreview(values.mainImage)
      return
    }

    // ✅ 3. Otherwise → clear preview (CREATE MODE with no image)
    setPreview(null)
  }, [values.images, values.mainImage])

  const imageError = errors.images as string | undefined

  return (
    <div className='max-w-2xl mx-auto bg-white dark:bg-card border dark:border-border rounded-2xl shadow-sm p-6 space-y-6'>
      {/* ✅ HEADER */}
      <div>
        <h2 className='text-xl font-semibold text-gray-900 dark:text-foreground'>Service Image</h2>
        <p className='text-sm text-gray-500 dark:text-muted-foreground'>
          Upload one main image that represents your service.
        </p>
      </div>

      {/* ✅ FILE INPUT */}
      <div className='flex flex-col gap-3'>
        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          Upload Image
        </label>

        <div className='border-2 border-dashed dark:border-gray-600 rounded-xl p-6 text-center hover:border-gray-900 dark:hover:border-gray-400 transition'>
          <input
            type='file'
            accept='image/*'
            className='hidden'
            id='service-image-upload'
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return

              // ✅ ONLY REAL FILE GOES INTO images[]
              setFieldValue('images', [file], true)
            }}
          />

          <label
            htmlFor='service-image-upload'
            className='cursor-pointer flex flex-col items-center gap-2'
          >
            <div className='w-12 h-12 rounded-full bg-gray-100 dark:bg-muted flex items-center justify-center'>
              📷
            </div>
            <span className='text-sm text-gray-700 dark:text-gray-300 font-medium'>
              Click to upload image
            </span>
            <span className='text-xs text-gray-500 dark:text-muted-foreground'>
              PNG, JPG, JPEG supported
            </span>
          </label>
        </div>
      </div>

      {/* ✅ IMAGE PREVIEW */}
      {preview && (
        <div className='flex items-center gap-4 border dark:border-border rounded-xl p-4'>
          <div className='relative w-40 h-28 rounded-lg overflow-hidden border dark:border-border'>
            <img
              src={preview}
              alt='preview'
              className='w-full h-full object-cover'
            />

            <button
              type='button'
              onClick={() => {
                // ✅ Clear both upload + existing preview
                setFieldValue('images', [], true)
                setFieldValue('mainImage', undefined, false)
              }}
              className='absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md shadow'
            >
              Remove
            </button>
          </div>

          <div className='text-sm text-gray-600 dark:text-muted-foreground'>
            <p className='font-medium dark:text-foreground'>Selected Image</p>
            <p className='text-xs text-gray-500 dark:text-muted-foreground'>
              This will be shown as your service thumbnail.
            </p>
          </div>
        </div>
      )}

      {/* ✅ ERROR */}
      {touched.images && imageError && (
        <p className='text-red-500 text-xs'>{imageError}</p>
      )}

      {/* ✅ INFO */}
      <div className='bg-gray-50 dark:bg-muted border dark:border-border rounded-lg p-4 text-sm text-gray-600 dark:text-muted-foreground'>
        💡 <span className='font-medium'>Tip:</span> Service Image should be
        image only.
      </div>
    </div>
  )
}
