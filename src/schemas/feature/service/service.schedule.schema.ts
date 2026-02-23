import * as Yup from 'yup'

export const serviceScheduleSchema = Yup.object({
  schedule: Yup.object({
    visibilityStartDate: Yup.date().required('Start date is required'),
    visibilityEndDate: Yup.date()
      .min(Yup.ref('visibilityStartDate'), 'End date must be after start date')
      .required('End date is required'),
    dailyWorkingWindows: Yup.array()
      .of(
        Yup.object({
          startTime: Yup.string().required('Start time required'),
          endTime: Yup.string().required('End time required'),
        })
      )
      .min(1, 'At least one time window required')
      .test('no-overlap', 'Time windows cannot overlap', (windows) => {
        if (!windows || windows.length === 0) return true

        const toMinutes = (time?: string): number => {
          if (!time || !time.includes(':')) return -1
          const [h, m] = time.split(':').map(Number)
          if (Number.isNaN(h) || Number.isNaN(m)) return -1
          return h * 60 + m
        }

        const converted = windows.map((w) => ({
          start: toMinutes(w.startTime),
          end: toMinutes(w.endTime),
        }))

        // ❌ Invalid time format
        if (converted.some((t) => t.start < 0 || t.end < 0)) return false

        const sorted = converted.sort((a, b) => a.start - b.start)

        for (let i = 0; i < sorted.length - 1; i++) {
          if (sorted[i].end > sorted[i + 1].start) {
            return false
          }
        }

        return true
      }),

    slotDurationMinutes: Yup.number()
      .min(5, 'Minimum 5 minutes')
      .required('Slot duration is required'),

    recurrenceType: Yup.string()
      .oneOf(['daily', 'weekly', 'monthly'])
      .required('Recurrence is required'),

    weeklyWorkingDays: Yup.array()
      .of(Yup.number().min(0, 'Invalid weekday').max(6, 'Invalid weekday'))
      .test(
        'unique-weekdays',
        'Weekdays must be unique',
        (arr) => !arr || new Set(arr).size === arr.length
      )
      .when('recurrenceType', {
        is: 'weekly',
        then: (schema) => schema.min(1, 'Select at least one weekday'),
        otherwise: (schema) => schema.optional(),
      }),

    monthlyWorkingDates: Yup.array()
      .of(Yup.number().min(1, 'Invalid date').max(31, 'Invalid date'))
      .test(
        'unique-dates',
        'Dates must be unique',
        (arr) => !arr || new Set(arr).size === arr.length
      )
      .when('recurrenceType', {
        is: 'monthly',
        then: (schema) => schema.min(1, 'Select at least one date'),
        otherwise: (schema) => schema.optional(),
      }),
  }),
})
