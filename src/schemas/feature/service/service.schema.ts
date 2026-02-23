import * as Yup from 'yup'
import {
  recurrenceType,
  recurrenceTypeValues,
} from '@/utils/constants/constants'

export const serviceSchema = Yup.object({
  // ✅ BASIC INFO
  serviceId: Yup.string().optional(),

  name: Yup.string().trim().required('Service name is required'),

  description: Yup.string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .optional(),

  subServiceCategoryId: Yup.string()
    .trim()
    .required('Sub service category is required'),

  // ✅ VARIANTS (OPTIONAL BUT STRUCTURED)
  serviceVariants: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().trim().required('Variant name is required'),

        description: Yup.string()
          .trim()
          .min(5, 'Variant description must be at least 5 characters')
          .optional(),

        price: Yup.number()
          .typeError('Variant price must be a number')
          .min(0, 'Variant price cannot be negative')
          .optional(),
      })
    )
    .optional(),

  // ✅ PRICING (REQUIRED)
  pricing: Yup.object({
    pricePerSlot: Yup.number()
      .typeError('Price per slot must be a number')
      .min(1, 'Price per slot must be at least 1')
      .required('Price per slot is required'),

    advanceAmountPerSlot: Yup.number()
      .typeError('Advance amount must be a number')
      .min(0, 'Advance amount cannot be negative')
      .required('Advance amount is required'),
  }).required(),

  // ✅ SCHEDULE
  schedule: Yup.object({
    visibilityStartDate: Yup.date().typeError('Invalid start date').optional(),

    visibilityEndDate: Yup.date()
      .typeError('Invalid end date')
      .min(
        Yup.ref('visibilityStartDate'),
        'End date cannot be before start date'
      )
      .optional(),

    dailyWorkingWindows: Yup.array()
      .of(
        Yup.object({
          startTime: Yup.string().trim().required('Start time is required'),

          endTime: Yup.string().trim().required('End time is required'),
        })
      )
      .min(1, 'At least one working window is required')
      .required(),

    slotDurationMinutes: Yup.number()
      .typeError('Slot duration must be a number')
      .min(1, 'Slot duration must be at least 1 minute')
      .required('Slot duration is required'),

    recurrenceType: Yup.mixed<recurrenceType>()
      .oneOf(Object.values(recurrenceTypeValues))
      .optional(),

    weeklyWorkingDays: Yup.array()
      .of(Yup.number().min(0, 'Invalid weekday').max(6, 'Invalid weekday'))
      .optional(),

    monthlyWorkingDates: Yup.array()
      .of(Yup.number().min(1, 'Invalid date').max(31, 'Invalid date'))
      .optional(),

    // ✅ OVERRIDE BLOCK
    overrideBlock: Yup.array()
      .of(
        Yup.object({
          startDateTime: Yup.date()
            .typeError('Invalid block start date')
            .required('Block start date is required'),

          endDateTime: Yup.date()
            .typeError('Invalid block end date')
            .min(Yup.ref('startDateTime'), 'Block end must be after start')
            .required('Block end date is required'),

          reason: Yup.string().trim().optional(),
        })
      )
      .optional(),

    // ✅ OVERRIDE CUSTOM
    overrideCustom: Yup.array()
      .of(
        Yup.object({
          startDateTime: Yup.date()
            .typeError('Invalid override start date')
            .required('Override start date is required'),

          endDateTime: Yup.date()
            .typeError('Invalid override end date')
            .min(Yup.ref('startDateTime'), 'Override end must be after start')
            .required('Override end date is required'),

          startTime: Yup.string().trim().optional(),
          endTime: Yup.string().trim().optional(),
        })
      )
      .optional(),
  }).required(),

  // ✅ IMAGES
  images: Yup.array()
    .of(
      Yup.mixed<File>()
        .test(
          'fileType',
          'Only image files are allowed',
          (file) =>
            !file ||
            (file instanceof File &&
              ['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
        )
        .test(
          'fileSize',
          'Image size must be less than 5MB',
          (file) => !file || file.size <= 5 * 1024 * 1024
        )
    )
    .optional(),
})
