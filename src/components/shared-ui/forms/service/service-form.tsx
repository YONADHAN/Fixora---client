// 'use client'
// import Calendar from 'react-calendar'
// import 'react-calendar/dist/Calendar.css'
// import { Formik, Form, Field, FormikHelpers } from 'formik'
// import * as Yup from 'yup'
// import { RequestCreateServiceDTO } from '@/dtos/service_dto'
// import { useState } from 'react'
// import { toast } from 'sonner'

import { IServiceFormValues } from '@/types/service_feature/service.types'

// export interface ServiceFormProps {
//   initialData?: Partial<RequestCreateServiceDTO>
//   onSubmit: (values: RequestCreateServiceDTO) => void
//   subCategories: Array<{ subServiceCategoryId: string; name: string }>
//   isLoading?: boolean
// }

// export const ServiceFormSection = ({
//   initialData = {},
//   onSubmit,
//   subCategories,
//   isLoading,
// }: ServiceFormProps) => {
//   const [holidayInput, setHolidayInput] = useState('')

//   const defaultValues: RequestCreateServiceDTO = {
//     subServiceCategoryId: '',
//     title: '',
//     description: '',
//     pricing: {
//       pricePerSlot: '',
//       isAdvanceRequired: 'false',
//       advanceAmountPerSlot: '',
//       currency: '',
//     },
//     isActiveStatusByVendor: 'true',
//     isActiveStatusByAdmin: undefined,
//     adminStatusNote: '',
//     schedule: {
//       visibilityStartDate: '',
//       visibilityEndDate: '',
//       workStartTime: '',
//       workEndTime: '',
//       slotDurationMinutes: '',
//       recurrenceType: '',
//       weeklyWorkingDays: '',
//       monthlyWorkingDates: '',
//       holidayDates: '',
//     },
//     images: [],
//   }

//   const initialValues: RequestCreateServiceDTO = {
//     ...defaultValues,
//     ...initialData,
//     pricing: {
//       ...defaultValues.pricing,
//       ...initialData.pricing,
//     },
//     schedule: {
//       ...defaultValues.schedule,
//       ...initialData.schedule,
//     },
//   }

//   type SetFieldValue = FormikHelpers<RequestCreateServiceDTO>['setFieldValue']

//   // ------------------- UTIL FUNCTIONS ---------------------
//   const toggleCheckboxValue = (listString: string, value: string) => {
//     const list = listString ? listString.split(',') : []
//     return list.includes(value)
//       ? list.filter((v) => v !== value).join(',')
//       : [...list, value].join(',')
//   }

//   const isDateWithinRange = (date: string, start: string, end: string) => {
//     if (!start || !end || !date) return false
//     return date >= start && date <= end
//   }

//   const workEndTimeToMinutes = (t: string) => {
//     const [h, m] = t.split(':').map(Number)
//     return h * 60 + m
//   }

//   const addHoliday = (
//     values: RequestCreateServiceDTO,
//     setFieldValue: SetFieldValue
//   ) => {
//     if (!holidayInput) return
//     const start = values.schedule.visibilityStartDate
//     const end = values.schedule.visibilityEndDate

//     if (!isDateWithinRange(holidayInput, start, end)) {
//       toast.error('Holiday date must be within the visibility range.')
//       return
//     }

//     const prev = values.schedule.holidayDates || ''
//     const existing = prev.split(',')

//     if (existing.includes(holidayInput)) {
//       toast.error('This holiday is already added.')
//       return
//     }

//     const updated = prev ? `${prev},${holidayInput}` : holidayInput
//     setFieldValue('schedule.holidayDates', updated)
//     setHolidayInput('')
//   }

//   const removeHoliday = (
//     index: number,
//     values: RequestCreateServiceDTO,
//     setFieldValue: SetFieldValue
//   ) => {
//     const list = values.schedule.holidayDates
//       .split(',')
//       .filter((_, i) => i !== index)
//     setFieldValue('schedule.holidayDates', list.join(','))
//   }

//   // ------------------- VALIDATION SCHEMA ---------------------
//   const validationSchema = Yup.object({
//     subServiceCategoryId: Yup.string().required('Please choose a category'),
//     title: Yup.string()
//       .trim()
//       .min(3, 'Minimum 3 characters')
//       .required('Required'),
//     description: Yup.string()
//       .trim()
//       .min(3, 'Minimum 3 characters')
//       .required('Required'),

//     pricing: Yup.object({
//       pricePerSlot: Yup.string().trim().required('Required'),
//       isAdvanceRequired: Yup.string().required('Required'),
//       advanceAmountPerSlot: Yup.string()
//         .trim()
//         .required('Required')
//         .test(
//           'advance-less-than-price',
//           'Advance amount must be less than the slot price',
//           function (value) {
//             const { pricePerSlot, isAdvanceRequired } = this.parent
//             if (isAdvanceRequired === 'false') return true
//             if (!value || !pricePerSlot) return true
//             return Number(value) < Number(pricePerSlot)
//           }
//         ),
//     }),

//     schedule: Yup.object({
//       visibilityStartDate: Yup.string().required('Required'),
//       visibilityEndDate: Yup.string().required('Required'),
//       workStartTime: Yup.string().required('Required'),
//       workEndTime: Yup.string()
//         .required('Required')
//         .test(
//           'is-after-start',
//           'End time must be later than start time',
//           function (endTime) {
//             const { workStartTime } = this.parent
//             if (!workStartTime || !endTime) return true
//             return (
//               workEndTimeToMinutes(endTime) >
//               workEndTimeToMinutes(workStartTime)
//             )
//           }
//         ),
//       slotDurationMinutes: Yup.string().required('Required'),
//       recurrenceType: Yup.string().required('Required'),
//     }),
//   })

//   const [previewImages, setPreviewImages] = useState<string[]>([])

//   const ErrorMsg = ({ name }: { name: string }) => (
//     <Field name={name}>
//       {({
//         form,
//       }: {
//         form: {
//           submitCount: number
//           errors: Record<string, any>
//         }
//       }) =>
//         form.submitCount > 0 && form.errors?.[name] ? (
//           <div className='text-red-600 text-sm mt-1'>{form.errors[name]}</div>
//         ) : null
//       }
//     </Field>
//   )
//   const handleNumericInput = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     setFieldValue: SetFieldValue,
//     fieldName: string
//   ) => {
//     const value = e.target.value
//     if (/^\d*$/.test(value)) {
//       setFieldValue(fieldName, value)
//     }
//   }

//   const WEEK_DAYS = [
//     { label: 'Sun', value: '0' },
//     { label: 'Mon', value: '1' },
//     { label: 'Tue', value: '2' },
//     { label: 'Wed', value: '3' },
//     { label: 'Thu', value: '4' },
//     { label: 'Fri', value: '5' },
//     { label: 'Sat', value: '6' },
//   ]

//   const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => ({
//     label: `${i + 1}`,
//     value: `${i + 1}`,
//   }))

//   const generateSlots = (
//     start: string,
//     end: string,
//     duration: number
//   ): string[] => {
//     if (!start || !end || !duration) return []
//     const slots: string[] = []
//     let current = new Date(`1970-01-01T${start}:00`)
//     const endDate = new Date(`1970-01-01T${end}:00`)

//     while (current < endDate) {
//       const next = new Date(current.getTime() + duration * 60000)
//       if (next > endDate) break
//       const format = (d: Date) => d.toTimeString().slice(0, 5)
//       slots.push(`${format(current)} - ${format(next)}`)
//       current = next
//     }

//     return slots
//   }

//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={validationSchema}
//       onSubmit={(values) => {
//         const recurrence = values.schedule.recurrenceType

//         if (recurrence === 'weekly') {
//           values.schedule.monthlyWorkingDates = ''
//         } else if (recurrence === 'monthly') {
//           values.schedule.weeklyWorkingDays = ''
//         } else if (recurrence === 'daily') {
//           values.schedule.weeklyWorkingDays = ''
//           values.schedule.monthlyWorkingDates = ''
//         }

//         onSubmit(values)
//       }}
//     >
//       {({
//         values,
//         setFieldValue,
//         errors,
//       }: {
//         values: RequestCreateServiceDTO
//         setFieldValue: SetFieldValue
//         errors: Record<string, any>
//       }) => {
//         const slots = generateSlots(
//           values.schedule.workStartTime,
//           values.schedule.workEndTime,
//           Number(values.schedule.slotDurationMinutes)
//         )

//         return (
//           <Form className='space-y-6 max-w-4xl mx-auto p-4 sm:p-6'>
//             {/* SUB CATEGORY */}
//             <div>
//               <label className='block text-sm font-semibold mb-2'>
//                 Sub Service Category
//               </label>
//               <Field
//                 as='select'
//                 name='subServiceCategoryId'
//                 className='border border-gray-300 rounded px-3 py-2 w-full max-w-md focus:ring-2 focus:ring-blue-500 focus:outline-none'
//               >
//                 <option value=''>Select category</option>
//                 {subCategories.map((c) => (
//                   <option
//                     key={c.subServiceCategoryId}
//                     value={c.subServiceCategoryId}
//                   >
//                     {c.name}
//                   </option>
//                 ))}
//               </Field>
//               <ErrorMsg name='subServiceCategoryId' />
//             </div>

//             {/* TITLE */}
//             <div>
//               <label className='block text-sm font-semibold mb-2'>Title</label>
//               <Field
//                 name='title'
//                 className='border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none'
//               />
//               <ErrorMsg name='title' />
//             </div>

//             {/* DESCRIPTION */}
//             <div>
//               <label className='block text-sm font-semibold mb-2'>
//                 Description
//               </label>
//               <Field
//                 as='textarea'
//                 name='description'
//                 rows={4}
//                 className='border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none'
//               />
//               <ErrorMsg name='description' />
//             </div>

//             {/* PRICING */}
//             <div className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
//               <h3 className='text-lg font-semibold mb-4'>Pricing</h3>

//               <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
//                 {/* Price Per Slot */}
//                 <div>
//                   <label className='block text-sm font-medium mb-1'>
//                     Price Per Slot
//                   </label>
//                   <Field name='pricing.pricePerSlot'>
//                     {({ field, form }: { field: any; form: any }) => (
//                       <input
//                         {...field}
//                         className='border border-gray-300 rounded px-3 py-2 w-full'
//                         onChange={(e) => {
//                           handleNumericInput(
//                             e,
//                             setFieldValue,
//                             'pricing.pricePerSlot'
//                           )
//                         }}
//                         onBlur={() =>
//                           form.setFieldTouched('pricing.pricePerSlot', true)
//                         }
//                       />
//                     )}
//                   </Field>
//                   <ErrorMsg name='pricing.pricePerSlot' />
//                 </div>

//                 {/* Advance Required */}
//                 <div>
//                   <label className='block text-sm font-medium mb-1'>
//                     Advance Required?
//                   </label>
//                   <Field
//                     as='select'
//                     name='pricing.isAdvanceRequired'
//                     className='border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none'
//                     onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
//                       const value = e.target.value
//                       setFieldValue('pricing.isAdvanceRequired', value)
//                       if (value === 'false') {
//                         setFieldValue('pricing.advanceAmountPerSlot', '0')
//                       }
//                     }}
//                   >
//                     <option value='false'>No</option>
//                     <option value='true'>Yes</option>
//                   </Field>
//                   <ErrorMsg name='pricing.isAdvanceRequired' />
//                 </div>

//                 {/* Advance Amount */}
//                 <div>
//                   <label className='block text-sm font-medium mb-1'>
//                     Advance Amount
//                   </label>
//                   <Field name='pricing.advanceAmountPerSlot'>
//                     {({ field }: { field: any }) => (
//                       <input
//                         {...field}
//                         type='text'
//                         disabled={values.pricing.isAdvanceRequired === 'false'}
//                         className='border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100'
//                         onChange={(e) =>
//                           handleNumericInput(
//                             e,
//                             setFieldValue,
//                             'pricing.advanceAmountPerSlot'
//                           )
//                         }
//                       />
//                     )}
//                   </Field>
//                   <ErrorMsg name='pricing.advanceAmountPerSlot' />
//                 </div>
//               </div>
//             </div>

//             {/* SCHEDULE */}
//             <div className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
//               <h3 className='text-lg font-semibold mb-4'>Schedule</h3>

//               <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
//                 {/* visibility dates */}
//                 <div>
//                   <label className='block text-sm font-medium mb-1'>
//                     Visibility Start
//                   </label>
//                   <Field
//                     type='date'
//                     name='schedule.visibilityStartDate'
//                     className='border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none'
//                   />
//                   <ErrorMsg name='schedule.visibilityStartDate' />
//                 </div>

//                 <div>
//                   <label className='block text-sm font-medium mb-1'>
//                     Visibility End
//                   </label>
//                   <Field
//                     type='date'
//                     name='schedule.visibilityEndDate'
//                     className='border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none'
//                   />
//                   <ErrorMsg name='schedule.visibilityEndDate' />
//                 </div>

//                 {/* time inputs */}
//                 <div>
//                   <label className='block text-sm font-medium mb-1'>
//                     Work Start Time
//                   </label>
//                   <Field
//                     type='time'
//                     name='schedule.workStartTime'
//                     className='border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none'
//                   />
//                   <ErrorMsg name='schedule.workStartTime' />
//                 </div>

//                 <div>
//                   <label className='block text-sm font-medium mb-1'>
//                     Work End Time
//                   </label>
//                   <Field
//                     type='time'
//                     name='schedule.workEndTime'
//                     className='border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none'
//                   />
//                   <ErrorMsg name='schedule.workEndTime' />
//                 </div>

//                 <div>
//                   <label className='block text-sm font-medium mb-1'>
//                     Slot Duration (mins)
//                   </label>
//                   <Field name='schedule.slotDurationMinutes'>
//                     {({ field }: { field: any }) => (
//                       <input
//                         {...field}
//                         type='text'
//                         className='border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none'
//                         onChange={(e) =>
//                           handleNumericInput(
//                             e,
//                             setFieldValue,
//                             'schedule.slotDurationMinutes'
//                           )
//                         }
//                         placeholder='30'
//                       />
//                     )}
//                   </Field>
//                   <ErrorMsg name='schedule.slotDurationMinutes' />
//                 </div>
//               </div>

//               {/* SLOT PREVIEW */}
//               {slots.length > 0 && (
//                 <div className='mb-4 p-3 bg-blue-50 rounded border border-blue-200'>
//                   <h4 className='text-sm font-semibold mb-2'>
//                     Generated Slots
//                   </h4>
//                   <div className='flex flex-wrap gap-2'>
//                     {slots.map((slot, idx) => (
//                       <div
//                         key={idx}
//                         className='px-2 py-1 bg-white border border-blue-300 rounded text-xs'
//                       >
//                         {slot}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {values.schedule.workStartTime &&
//                 values.schedule.workEndTime &&
//                 values.schedule.workStartTime >=
//                   values.schedule.workEndTime && (
//                   <div className='mb-4 p-2 bg-red-50 border border-red-300 rounded text-red-700 text-sm'>
//                     Start time must be earlier than end time.
//                   </div>
//                 )}

//               <div>
//                 <label className='block text-sm font-medium mb-2'>
//                   Recurrence
//                 </label>
//                 <div className='flex flex-wrap gap-3'>
//                   {['daily', 'weekly', 'monthly'].map((type) => (
//                     <label
//                       key={type}
//                       className='flex items-center gap-2 cursor-pointer'
//                     >
//                       <Field
//                         type='radio'
//                         name='schedule.recurrenceType'
//                         value={type}
//                         className='w-4 h-4'
//                       />
//                       <span className='text-sm capitalize'>{type}</span>
//                     </label>
//                   ))}
//                 </div>
//                 <ErrorMsg name='schedule.recurrenceType' />
//               </div>
//             </div>

//             {/* WEEKLY WORKING DAYS */}
//             {values.schedule.recurrenceType === 'weekly' && (
//               <div className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
//                 <h4 className='text-sm font-semibold mb-3'>
//                   Weekly Working Days
//                 </h4>
//                 <div className='flex flex-wrap gap-3'>
//                   {WEEK_DAYS.map((d) => {
//                     const selected =
//                       values.schedule.weeklyWorkingDays?.split(',') || []
//                     return (
//                       <label
//                         key={d.value}
//                         className='flex items-center gap-2 cursor-pointer'
//                       >
//                         <input
//                           type='checkbox'
//                           checked={selected.includes(d.value)}
//                           onChange={() => {
//                             const updated = toggleCheckboxValue(
//                               values.schedule.weeklyWorkingDays as string,
//                               d.value
//                             )
//                             setFieldValue('schedule.weeklyWorkingDays', updated)
//                           }}
//                           className='w-4 h-4'
//                         />
//                         <span className='text-sm'>{d.label}</span>
//                       </label>
//                     )
//                   })}
//                 </div>
//               </div>
//             )}

//             {/* MONTHLY WORKING DATES */}
//             {values.schedule.recurrenceType === 'monthly' && (
//               <div className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
//                 <h4 className='text-sm font-semibold mb-3'>
//                   Monthly Working Dates
//                 </h4>

//                 <div className='grid grid-cols-7 gap-2'>
//                   {MONTH_DAYS.map((d) => {
//                     const selected =
//                       values.schedule.monthlyWorkingDates?.split(',') || []
//                     return (
//                       <label
//                         key={d.value}
//                         className='flex items-center gap-1 cursor-pointer text-sm'
//                       >
//                         <input
//                           type='checkbox'
//                           checked={selected.includes(d.value)}
//                           onChange={() => {
//                             const updated = toggleCheckboxValue(
//                               values.schedule.monthlyWorkingDates as string,
//                               d.value
//                             )
//                             setFieldValue(
//                               'schedule.monthlyWorkingDates',
//                               updated
//                             )
//                           }}
//                           className='w-4 h-4'
//                         />
//                         {d.label}
//                       </label>
//                     )
//                   })}
//                 </div>
//               </div>
//             )}

//             {/* HOLIDAY DATES */}
//             {values.schedule.visibilityStartDate &&
//               values.schedule.visibilityEndDate &&
//               values.schedule.visibilityStartDate <
//                 values.schedule.visibilityEndDate && (
//                 <div className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
//                   <h4 className='text-sm font-semibold mb-3'>Holiday Dates</h4>

//                   <div className='max-w-sm mx-auto mb-4'>
//                     <Calendar
//                       onChange={(date: Date) => {
//                         const iso = date.toLocaleDateString('en-CA')
//                         setHolidayInput(iso)
//                       }}
//                       value={holidayInput ? new Date(holidayInput) : new Date()}
//                       tileClassName={({ date }) => {
//                         const iso = date.toLocaleDateString('en-CA')
//                         const holidays =
//                           values.schedule.holidayDates?.split(',') || []
//                         return holidays.includes(iso)
//                           ? 'react-calendar__tile--holiday'
//                           : ''
//                       }}
//                       minDate={
//                         values.schedule.visibilityStartDate
//                           ? new Date(values.schedule.visibilityStartDate)
//                           : undefined
//                       }
//                       maxDate={
//                         values.schedule.visibilityEndDate
//                           ? new Date(values.schedule.visibilityEndDate)
//                           : undefined
//                       }
//                     />
//                   </div>

//                   <div className='flex gap-2 mb-3'>
//                     <input
//                       type='text'
//                       value={holidayInput}
//                       readOnly
//                       placeholder='Select date from calendar'
//                       className='border border-gray-300 rounded px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none'
//                     />
//                     <button
//                       type='button'
//                       onClick={() => addHoliday(values, setFieldValue)}
//                       className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
//                       disabled={!holidayInput}
//                     >
//                       Add
//                     </button>
//                   </div>

//                   <div className='flex flex-wrap gap-2'>
//                     {values.schedule.holidayDates &&
//                       values.schedule.holidayDates.split(',').map((date, i) => (
//                         <div
//                           key={i}
//                           className='px-3 py-1 bg-red-100 text-red-800 rounded flex items-center gap-2 text-sm'
//                         >
//                           {date}
//                           <button
//                             type='button'
//                             onClick={() =>
//                               removeHoliday(i, values, setFieldValue)
//                             }
//                             className='text-red-600 font-bold hover:text-red-800'
//                           >
//                             ×
//                           </button>
//                         </div>
//                       ))}
//                   </div>
//                 </div>
//               )}

//             {/* IMAGE UPLOAD */}
//             <div>
//               <label className='block text-sm font-semibold mb-2'>Images</label>
//               <input
//                 type='file'
//                 multiple
//                 accept='image/*'
//                 onChange={(e) => {
//                   const files = Array.from(e.target.files || [])
//                   setFieldValue('images', files)
//                   const urls = files.map((f) => URL.createObjectURL(f))
//                   setPreviewImages(urls)
//                 }}
//                 className='border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none'
//               />
//               <div className='flex flex-wrap gap-3 mt-3'>
//                 {previewImages.map((src, idx) => (
//                   <img
//                     key={idx}
//                     src={src}
//                     alt={`Preview ${idx}`}
//                     className='w-20 h-20 object-cover rounded border border-gray-300'
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* SUBMIT */}
//             <button
//               type='submit'
//               disabled={isLoading}
//               className='w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
//             >
//               {isLoading ? 'Submitting...' : 'Submit'}
//             </button>
//           </Form>
//         )
//       }}
//     </Formik>
//   )
// }

export const initialServiceFormValues: IServiceFormValues = {
  serviceId: '',
  name: '',
  description: '',
  subServiceCategoryId: '',

  serviceVariants: [],

  pricing: {
    pricePerSlot: 0,
    advanceAmountPerSlot: 0,
  },

  schedule: {
    visibilityStartDate: undefined,
    visibilityEndDate: undefined,

    dailyWorkingWindows: [{ startTime: '', endTime: '' }],

    slotDurationMinutes: 0,
    recurrenceType: undefined,
    weeklyWorkingDays: [],
    monthlyWorkingDates: [],
    overrideBlock: [],
    overrideCustom: [],
  },

  images: [],
  mainImage: undefined,
}
