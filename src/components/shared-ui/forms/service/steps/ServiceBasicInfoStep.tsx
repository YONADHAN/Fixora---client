'use client'
import { useFormikContext } from 'formik'
import { IServiceFormValues } from '@/types/service_feature/service.types'
import { useGetActiveSubServiceCategories } from '@/lib/hooks/useSubServiceCategory'
import { useRouter } from 'next/navigation'
export default function ServiceBasicInfoStep() {
  const { values, handleChange, errors, touched, setFieldTouched } =
    useFormikContext<IServiceFormValues>()
  const router = useRouter()
  const { data, isLoading } = useGetActiveSubServiceCategories()
  interface Item {
    name: string
    subServiceCategoryId: string
  }
  const handleTouchedChange =
    (field: keyof IServiceFormValues) =>
      (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => {
        handleChange(e)
        setFieldTouched(field, true, false)
      }

  return (
    <div className='max-w-2xl mx-auto bg-white dark:bg-card border dark:border-border rounded-2xl shadow-sm p-6 space-y-6'>
      {/* ✅ HEADER */}
      <div>
        <h2 className='text-xl font-semibold text-gray-900 dark:text-foreground'>
          Service Basic Information
        </h2>
        <p className='text-sm text-gray-500 dark:text-muted-foreground'>
          Enter the basic details of your service
        </p>
      </div>

      {/* ✅ SERVICE NAME */}
      <div className='space-y-1'>
        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          Service Name
        </label>
        <input
          name='name'
          value={values.name}
          onChange={handleTouchedChange('name')}
          placeholder='Enter service name'
          className='border dark:border-input rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent dark:bg-background dark:text-foreground'
        />
        {touched.name && errors.name && (
          <p className='text-red-500 text-xs'>{errors.name}</p>
        )}
      </div>

      {/* ✅ DESCRIPTION */}
      <div className='space-y-1'>
        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          Service Description
        </label>
        <textarea
          name='description'
          value={values.description}
          onChange={handleTouchedChange('description')}
          placeholder='Describe your service'
          rows={4}
          className='border dark:border-input rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none bg-transparent dark:bg-background dark:text-foreground'
        />
        {touched.description && errors.description && (
          <p className='text-red-500 text-xs'>{errors.description}</p>
        )}
      </div>

      {/* ✅ SUB CATEGORY (DYNAMIC FROM API) */}
      <div className='space-y-1'>
        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          Sub Service Category
        </label>

        <select
          name='subServiceCategoryId'
          value={values.subServiceCategoryId}
          onChange={handleTouchedChange('subServiceCategoryId')}
          className='border dark:border-input rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-background dark:text-foreground'
          disabled={isLoading}
        >
          <option value=''>Select Sub Category</option>

          {data?.map((item: Item) => (
            <option
              key={item.subServiceCategoryId}
              value={item.subServiceCategoryId}
              className='dark:bg-background dark:text-foreground'
            >
              {item.name}
            </option>
          ))}
        </select>

        {touched.subServiceCategoryId && errors.subServiceCategoryId && (
          <p className='text-red-500 text-xs'>{errors.subServiceCategoryId}</p>
        )}
        {/* ✅ INFO BANNER */}
        <div className='bg-gray-50 dark:bg-muted border dark:border-border rounded-lg p-4 text-sm text-gray-600 dark:text-muted-foreground'>
          💡 <span className='font-medium'>Tip:</span> If you don&apos;t find
          your required sub service category, please{' '}
          <span
            className='text-blue-600 dark:text-blue-400 cursor-pointer '
            onClick={() => router.push('/vendor/sub-service-category/add')}
          >
            create your new sub service category
          </span>
          . After getting admins approval you can use this to create the
          service.
        </div>
      </div>
    </div>
  )
}
