'use client'

import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { RequestCreateServiceDTO } from '@/dtos/service_dto'
import { useState } from 'react'

export interface ServiceFormProps {
  initialData?: Partial<RequestCreateServiceDTO>
  onSubmit: (values: RequestCreateServiceDTO) => void
  subCategories: Array<{ subServiceCategoryId: string; name: string }>
  isLoading?: boolean
}

export const ServiceFormSection = ({
  initialData = {},
  onSubmit,
  subCategories,
  isLoading,
}: ServiceFormProps) => {
  const [holidayInput, setHolidayInput] = useState('')

  const defaultValues: RequestCreateServiceDTO = {
    subServiceCategoryId: '',
    title: '',
    description: '',
    pricing: {
      pricePerSlot: '',
      isAdvanceRequired: 'false',
      advanceAmountPerSlot: '',
      currency: '',
    },
    isActiveStatusByVendor: 'true',
    isActiveStatusByAdmin: undefined,
    adminStatusNote: '',
    schedule: {
      visibilityStartDate: '',
      visibilityEndDate: '',
      workStartTime: '',
      workEndTime: '',
      slotDurationMinutes: '',
      recurrenceType: '',
      weeklyWorkingDays: '',
      monthlyWorkingDates: '',
      holidayDates: '',
    },
    images: [],
  }

  const initialValues: RequestCreateServiceDTO = {
    ...defaultValues,
    ...initialData,
    pricing: {
      ...defaultValues.pricing,
      ...initialData.pricing,
    },
    schedule: {
      ...defaultValues.schedule,
      ...initialData.schedule,
    },
  }
  const toggleCheckboxValue = (listString: string, value: string) => {
    const list = listString ? listString.split(',') : []

    if (list.includes(value)) {
      return list.filter((v) => v !== value).join(',')
    } else {
      return [...list, value].join(',')
    }
  }
  const addHoliday = (values: any, setFieldValue: any) => {
    if (!holidayInput) return

    // 1) Get visibility range
    const start = values.schedule.visibilityStartDate
    const end = values.schedule.visibilityEndDate

    // 2) Validate date is within range
    if (!isDateWithinRange(holidayInput, start, end)) {
      alert('Holiday date must be within the visibility range.')
      return
    }

    // 3) Prevent duplicates
    const prev = values.schedule.holidayDates || ''
    const existing = prev.split(',')
    if (existing.includes(holidayInput)) {
      alert('This holiday is already added.')
      return
    }

    // 4) Add holiday
    const updated = prev ? `${prev},${holidayInput}` : holidayInput
    setFieldValue('schedule.holidayDates', updated)

    // Reset field
    setHolidayInput('')
  }

  const removeHoliday = (index: number, values: any, setFieldValue: any) => {
    const list = values.schedule.holidayDates
      .split(',')
      .filter((_, i) => i !== index)

    setFieldValue('schedule.holidayDates', list.join(','))
  }
  const isDateWithinRange = (date: string, start: string, end: string) => {
    if (!start || !end || !date) return false
    return date >= start && date <= end
  }

  const handleHolidayKeyDown = (e: any, values: any, setFieldValue: any) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      if (!holidayInput.trim()) return

      const prev = values.schedule.holidayDates || ''
      const updated = prev
        ? `${prev},${holidayInput.trim()}`
        : holidayInput.trim()

      setFieldValue('schedule.holidayDates', updated)
      setHolidayInput('')
    }
  }

  const validationSchema = Yup.object({
    subServiceCategoryId: Yup.string().required('Please choose a category'),
    title: Yup.string()
      .trim()
      .min(3, 'Minimum 3 characters')
      .required('Required'),
    description: Yup.string()
      .trim()
      .min(3, 'Minimum 3 characters')
      .required('Required'),
    pricing: Yup.object({
      pricePerSlot: Yup.string().trim().required('Required'),
      isAdvanceRequired: Yup.string().required('Required'),
      advanceAmountPerSlot: Yup.string().trim().required('Required'),
    }),
    schedule: Yup.object({
      visibilityStartDate: Yup.string().required('Required'),
      visibilityEndDate: Yup.string().required('Required'),
      workStartTime: Yup.string().required('Required'),
      workEndTime: Yup.string().required('Required'),
      slotDurationMinutes: Yup.string().required('Required'),
      recurrenceType: Yup.string().required('Required'),
    }),
  })

  const [previewImages, setPreviewImages] = useState<string[]>([])

  // Small clean helper to display errors nicely
  const ErrorMsg = ({ name }: { name: string }) => (
    <Field name={name}>
      {({ form }: any) =>
        form.submitCount > 0 && form.errors?.[name] ? (
          <p className='text-red-500 text-sm mt-1'>{form.errors[name]}</p>
        ) : null
      }
    </Field>
  )

  const handleNumericInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any,
    fieldName: string
  ) => {
    const value = e.target.value

    // Allow only digits
    if (/^\d*$/.test(value)) {
      setFieldValue(fieldName, value)
    }
  }

  const WEEK_DAYS = [
    { label: 'Sun', value: '0' },
    { label: 'Mon', value: '1' },
    { label: 'Tue', value: '2' },
    { label: 'Wed', value: '3' },
    { label: 'Thu', value: '4' },
    { label: 'Fri', value: '5' },
    { label: 'Sat', value: '6' },
  ]

  const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => ({
    label: `${i + 1}`,
    value: `${i + 1}`,
  }))

  return (
    <Formik
      validateOnBlur={true}
      validateOnChange={false}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => onSubmit(values)}
    >
      {({ values, setFieldValue, errors }) => (
        <Form className='space-y-8'>
          {/* ------------------- SUB CATEGORY ------------------- */}
          <div>
            <label className='block font-medium mb-1'>
              Sub Service Category
            </label>
            <Field
              as='select'
              name='subServiceCategoryId'
              className='border rounded px-3 py-2 w-full'
            >
              <option value=''>Select category</option>
              {subCategories.map((c) => (
                <option
                  key={c.subServiceCategoryId}
                  value={c.subServiceCategoryId}
                >
                  {c.name}
                </option>
              ))}
            </Field>
            <ErrorMsg name='subServiceCategoryId' />
          </div>

          {/* ------------------- TITLE ------------------- */}
          <div>
            <label className='block font-medium mb-1'>Title</label>
            <Field
              name='title'
              className='border rounded px-3 py-2 w-full'
              placeholder='Deep Cleaning Service'
            />
            <ErrorMsg name='title' />
          </div>

          {/* ------------------- DESCRIPTION ------------------- */}
          <div>
            <label className='block font-medium mb-1'>Description</label>
            <Field
              as='textarea'
              name='description'
              className='border rounded px-3 py-2 w-full h-24'
              placeholder='Write about your service...'
            />
            <ErrorMsg name='description' />
          </div>

          {/* pricing */}
          <div>
            <h2 className='font-semibold mb-2'>Pricing</h2>

            <div className='grid grid-cols-3 gap-4'>
              {/* Price Per Slot */}
              <div>
                <label>Price Per Slot</label>
                <Field name='pricing.pricePerSlot'>
                  {({ field }: any) => (
                    <input
                      {...field}
                      className='border rounded px-3 py-2 w-full'
                      onChange={(e) =>
                        handleNumericInput(
                          e,
                          setFieldValue,
                          'pricing.pricePerSlot'
                        )
                      }
                    />
                  )}
                </Field>
                <ErrorMsg name='pricing.pricePerSlot' />
              </div>

              {/* Advance Required */}
              <div>
                <label>Advance Required?</label>
                <Field
                  as='select'
                  name='pricing.isAdvanceRequired'
                  className='border rounded px-3 py-2 w-full'
                  onChange={(e: any) => {
                    const value = e.target.value
                    setFieldValue('pricing.isAdvanceRequired', value)

                    if (value === 'false') {
                      setFieldValue('pricing.advanceAmountPerSlot', '0')
                    }
                  }}
                >
                  <option value='false'>No</option>
                  <option value='true'>Yes</option>
                </Field>
                <ErrorMsg name='pricing.isAdvanceRequired' />
              </div>

              {/* Advance Amount */}
              <div>
                <label>Advance Amount</label>
                <Field name='pricing.advanceAmountPerSlot'>
                  {({ field }: any) => (
                    <input
                      {...field}
                      className='border rounded px-3 py-2 w-full'
                      disabled={values.pricing.isAdvanceRequired === 'false'}
                      onChange={(e) =>
                        handleNumericInput(
                          e,
                          setFieldValue,
                          'pricing.advanceAmountPerSlot'
                        )
                      }
                    />
                  )}
                </Field>
                <ErrorMsg name='pricing.advanceAmountPerSlot' />
              </div>
            </div>
          </div>

          {/* ------------------- SCHEDULE ------------------- */}
          <div>
            <h2 className='font-semibold mb-2'>Schedule</h2>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label>Visibility Start</label>
                <Field
                  type='date'
                  name='schedule.visibilityStartDate'
                  className='border rounded px-3 py-2 w-full'
                />
                <ErrorMsg name='schedule.visibilityStartDate' />
              </div>

              <div>
                <label>Visibility End</label>
                <Field
                  type='date'
                  name='schedule.visibilityEndDate'
                  className='border rounded px-3 py-2 w-full'
                />
                <ErrorMsg name='schedule.visibilityEndDate' />
              </div>

              <div>
                <label>Work Start Time</label>
                <Field
                  type='time'
                  name='schedule.workStartTime'
                  className='border rounded px-3 py-2 w-full'
                />
                <ErrorMsg name='schedule.workStartTime' />
              </div>

              <div>
                <label>Work End Time</label>
                <Field
                  type='time'
                  name='schedule.workEndTime'
                  className='border rounded px-3 py-2 w-full'
                />
                <ErrorMsg name='schedule.workEndTime' />
              </div>

              <Field name='schedule.slotDurationMinutes'>
                {({ field }: any) => (
                  <input
                    {...field}
                    className='border rounded px-3 py-0 w-full'
                    onChange={(e) =>
                      handleNumericInput(
                        e,
                        setFieldValue,
                        'schedule.slotDurationMinutes'
                      )
                    }
                    placeholder='30'
                  />
                )}
              </Field>
              <ErrorMsg name='schedule.slotDurationMinutes' />

              <div>
                <label>Recurrence</label>
                <Field
                  as='select'
                  name='schedule.recurrenceType'
                  className='border rounded px-3 py-2 w-full'
                >
                  {/* <option value='daily'>Select recurrence</option> */}
                  <option value='daily'>Daily</option>
                  <option value='weekly'>Weekly</option>
                  <option value='monthly'>Monthly</option>
                </Field>
                <ErrorMsg name='schedule.recurrenceType' />
              </div>
            </div>
          </div>

          {/* ------------------- WEEKLY, DATES, HOLIDAYS ------------------- */}
          {values.schedule.recurrenceType === 'weekly' && (
            <div>
              <label className='font-medium'>Weekly Working Days</label>
              <div className='grid grid-cols-7 gap-2 mt-2'>
                {WEEK_DAYS.map((d) => {
                  const selected =
                    values.schedule.weeklyWorkingDays?.split(',') || []

                  return (
                    <label
                      key={d.value}
                      className='flex items-center gap-1 text-sm'
                    >
                      <input
                        type='checkbox'
                        checked={selected.includes(d.value)}
                        onChange={() => {
                          const updated = toggleCheckboxValue(
                            values.schedule.weeklyWorkingDays as string,
                            d.value
                          )
                          setFieldValue('schedule.weeklyWorkingDays', updated)
                        }}
                      />
                      {d.label}
                    </label>
                  )
                })}
              </div>
            </div>
          )}

          {values.schedule.recurrenceType === 'monthly' && (
            <div>
              <label className='font-medium'>Monthly Working Dates</label>
              <div className='grid grid-cols-10 gap-2 mt-2'>
                {MONTH_DAYS.map((d) => {
                  const selected =
                    values.schedule.monthlyWorkingDates?.split(',') || []

                  return (
                    <label
                      key={d.value}
                      className='flex items-center gap-1 text-xs'
                    >
                      <input
                        type='checkbox'
                        checked={selected.includes(d.value)}
                        onChange={() => {
                          const updated = toggleCheckboxValue(
                            values.schedule.monthlyWorkingDates as string,
                            d.value
                          )
                          setFieldValue('schedule.monthlyWorkingDates', updated)
                        }}
                      />
                      {d.label}
                    </label>
                  )
                })}
              </div>
            </div>
          )}

          <div>
            <label className='block font-medium mb-1'>Holiday Dates</label>

            {/* Calendar Picker */}
            <div className='flex items-center gap-2'>
              <input
                type='date'
                value={holidayInput}
                onChange={(e) => setHolidayInput(e.target.value)}
                className='border rounded px-3 py-2'
              />

              <button
                type='button'
                onClick={() => addHoliday(values, setFieldValue)}
                className='px-3 py-2 bg-blue-600 text-white rounded'
                disabled={!holidayInput}
              >
                Add
              </button>
            </div>

            {/* Chips */}
            <div className='flex gap-2 flex-wrap mt-3'>
              {values.schedule.holidayDates &&
                values.schedule.holidayDates.split(',').map((date, i) => (
                  <div
                    key={i}
                    className='flex items-center gap-1 bg-gray-200 text-sm px-2 py-1 rounded-full'
                  >
                    <span>{date}</span>

                    {/* Remove button */}
                    <button
                      type='button'
                      onClick={() => removeHoliday(i, values, setFieldValue)}
                      className='text-red-500 font-bold ml-1'
                    >
                      ×
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* ------------------- IMAGE UPLOAD ------------------- */}
          <div>
            <label className='block font-medium mb-1'>Images</label>
            <input
              type='file'
              multiple
              accept='image/*'
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                setFieldValue('images', files)

                const urls = files.map((f) => URL.createObjectURL(f))
                setPreviewImages(urls)
              }}
            />

            {/* Preview Images */}
            <div className='flex gap-4 mt-4'>
              {previewImages.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt='preview'
                  className='w-20 h-20 object-cover rounded border'
                />
              ))}
            </div>
          </div>

          {/* ------------------- SUBMIT ------------------- */}
          <button
            type='submit'
            disabled={isLoading}
            className='px-5 py-2 bg-black text-white rounded'
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </Form>
      )}
    </Formik>
  )
}
