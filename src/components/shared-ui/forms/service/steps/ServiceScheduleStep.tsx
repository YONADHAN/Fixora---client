import { useState } from 'react'
import { useFormikContext, FormikErrors } from 'formik'
import { IServiceFormValues } from '@/types/service_feature/service.types'

export default function ServiceScheduleStep() {
  const {
    values,
    handleChange,
    touched,
    errors,
    setFieldTouched,
    setFieldValue,
  } = useFormikContext<IServiceFormValues>()

  const scheduleErrors = errors.schedule as
    | FormikErrors<IServiceFormValues['schedule']>
    | undefined

  const [newStartTime, setNewStartTime] = useState('')
  const [newEndTime, setNewEndTime] = useState('')
  const [windowError, setWindowError] = useState<string | null>(null)

  // ✅ SAFE TIME PARSER
  const toMinutes = (time?: string): number => {
    if (!time || !time.includes(':')) return -1
    const [h, m] = time.split(':').map(Number)
    if (Number.isNaN(h) || Number.isNaN(m)) return -1
    return h * 60 + m
  }

  // ✅ ADD DAILY WINDOW
  const handleAddWindow = () => {
    setWindowError(null)

    if (!newStartTime || !newEndTime) {
      setWindowError('Start and end time are required')
      return
    }

    const start = toMinutes(newStartTime)
    const end = toMinutes(newEndTime)

    if (start < 0 || end < 0) {
      setWindowError('Invalid time format')
      return
    }

    if (start >= end) {
      setWindowError('Start time must be before end time')
      return
    }

    const existing =
      values.schedule.dailyWorkingWindows?.filter(
        (w) => w.startTime && w.endTime
      ) || []

    if (
      existing.some(
        (w) => w.startTime === newStartTime && w.endTime === newEndTime
      )
    ) {
      setWindowError('This time window already exists')
      return
    }

    const overlaps = existing.some((w) => {
      const s = toMinutes(w.startTime)
      const e = toMinutes(w.endTime)
      if (s === -1 || e === -1) return false
      return start < e && end > s
    })

    if (overlaps) {
      setWindowError('This window overlaps with an existing one')
      return
    }

    const updated = [
      ...existing,
      { startTime: newStartTime, endTime: newEndTime },
    ]

    setFieldTouched('schedule.dailyWorkingWindows', true, false)
    setFieldValue('schedule.dailyWorkingWindows', updated, true)

    setNewStartTime('')
    setNewEndTime('')
  }

  const handleRemoveWindow = (index: number) => {
    const updated = values.schedule.dailyWorkingWindows.filter(
      (_, i) => i !== index
    )
    setFieldValue('schedule.dailyWorkingWindows', updated, true)
  }

  const dailyWindowsError =
    typeof scheduleErrors?.dailyWorkingWindows === 'string'
      ? scheduleErrors.dailyWorkingWindows
      : undefined

  return (
    <div className='max-w-4xl mx-auto bg-white dark:bg-card border dark:border-border rounded-2xl shadow-sm p-6 space-y-10'>
      {/* ✅ HEADER */}
      <div>
        <h2 className='text-xl font-semibold text-gray-900 dark:text-foreground'>
          Service Schedule
        </h2>
        <p className='text-sm text-gray-500 dark:text-muted-foreground'>
          Configure when customers can book this service.
        </p>
      </div>

      {/* ✅ DATE RANGE */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-1'>
          <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
            Start Date
          </label>
          <input
            type='date'
            name='schedule.visibilityStartDate'
            onChange={handleChange}
            onBlur={() => setFieldTouched('schedule.visibilityStartDate', true)}
            className='w-full p-2 border dark:border-input rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white outline-none bg-transparent dark:bg-background dark:text-foreground'
          />
          {touched.schedule?.visibilityStartDate &&
            scheduleErrors?.visibilityStartDate && (
              <p className='text-red-500 text-xs'>
                {scheduleErrors.visibilityStartDate}
              </p>
            )}
        </div>

        <div className='space-y-1'>
          <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>End Date</label>
          <input
            type='date'
            name='schedule.visibilityEndDate'
            onChange={handleChange}
            onBlur={() => setFieldTouched('schedule.visibilityEndDate', true)}
            className='w-full p-2 border dark:border-input rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white outline-none bg-transparent dark:bg-background dark:text-foreground'
          />
          {touched.schedule?.visibilityEndDate &&
            scheduleErrors?.visibilityEndDate && (
              <p className='text-red-500 text-xs'>
                {scheduleErrors.visibilityEndDate}
              </p>
            )}
        </div>
      </div>

      {/* ✅ SLOT DURATION */}
      <div className='space-y-1'>
        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          Slot Duration (minutes)
        </label>
        <input
          type='number'
          name='schedule.slotDurationMinutes'
          value={values.schedule.slotDurationMinutes}
          onChange={handleChange}
          className='w-full p-2 border dark:border-input rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white outline-none bg-transparent dark:bg-background dark:text-foreground'
        />
      </div>

      {/* ✅ DAILY WORKING WINDOWS */}
      <div className='space-y-4'>
        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          Daily Working Windows
        </label>

        <div className='flex flex-wrap gap-3 items-center bg-gray-50 dark:bg-muted p-4 rounded-lg border dark:border-border'>
          <input
            type='time'
            value={newStartTime}
            onChange={(e) => setNewStartTime(e.target.value)}
            className='border dark:border-input p-2 rounded-lg bg-transparent dark:bg-background dark:text-foreground'
          />
          <span className='text-gray-600 dark:text-muted-foreground'>to</span>
          <input
            type='time'
            value={newEndTime}
            onChange={(e) => setNewEndTime(e.target.value)}
            className='border dark:border-input p-2 rounded-lg bg-transparent dark:bg-background dark:text-foreground'
          />

          <button
            type='button'
            onClick={handleAddWindow}
            className='px-4 py-2 bg-black dark:bg-primary text-white dark:text-primary-foreground rounded-lg hover:bg-gray-900 dark:hover:bg-primary/90'
          >
            Add Window
          </button>
        </div>

        {windowError && <p className='text-red-500 text-sm'>{windowError}</p>}

        <div className='space-y-2'>
          {values.schedule.dailyWorkingWindows
            .filter((w) => w.startTime && w.endTime)
            .map((w, idx) => (
              <div
                key={idx}
                className='flex justify-between items-center bg-gray-50 dark:bg-muted border dark:border-border rounded-lg p-3'
              >
                <span className='text-sm font-medium dark:text-foreground'>
                  {w.startTime} — {w.endTime}
                </span>

                <button
                  type='button'
                  onClick={() => handleRemoveWindow(idx)}
                  className='text-xs text-red-600 hover:underline'
                >
                  Remove
                </button>
              </div>
            ))}
        </div>

        {dailyWindowsError && (
          <p className='text-red-500 text-sm'>{dailyWindowsError}</p>
        )}
      </div>

      {/* ✅ RECURRENCE */}
      <div className='space-y-1'>
        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>Recurrence</label>
        <select
          name='schedule.recurrenceType'
          value={values.schedule.recurrenceType || ''}
          onChange={handleChange}
          onBlur={() => setFieldTouched('schedule.recurrenceType', true)}
          className='w-full p-2 border dark:border-input rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white outline-none bg-transparent dark:bg-background dark:text-foreground'
        >
          <option value='' className='dark:bg-background'>Select recurrence</option>
          <option value='daily' className='dark:bg-background'>Daily</option>
          <option value='weekly' className='dark:bg-background'>Weekly</option>
          <option value='monthly' className='dark:bg-background'>Monthly</option>
        </select>

        {touched.schedule?.recurrenceType && scheduleErrors?.recurrenceType && (
          <p className='text-red-500 text-xs'>
            {scheduleErrors.recurrenceType}
          </p>
        )}
      </div>

      {/* ✅ WEEKLY */}
      {values.schedule.recurrenceType === 'weekly' && (
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>Weekdays</label>

          <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
            {[0, 1, 2, 3, 4, 5, 6].map((day) => (
              <label
                key={day}
                className='flex items-center gap-2 border dark:border-input rounded-lg p-2 text-sm dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-muted/50 cursor-pointer'
              >
                <input
                  type='checkbox'
                  checked={
                    values.schedule.weeklyWorkingDays?.includes(day) || false
                  }
                  onChange={(e) => {
                    const checked = e.target.checked
                    const current = values.schedule.weeklyWorkingDays || []
                    const updated = checked
                      ? [...current, day]
                      : current.filter((d) => d !== day)

                    setFieldTouched('schedule.weeklyWorkingDays', true, false)
                    setFieldValue('schedule.weeklyWorkingDays', updated, true)
                  }}
                  className='accent-black dark:accent-primary'
                />
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ✅ MONTHLY */}
      {values.schedule.recurrenceType === 'monthly' && (
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
            Dates (1–31)
          </label>

          <div className='grid grid-cols-6 gap-2 max-h-40 overflow-y-auto border dark:border-input rounded-lg p-3 dark:bg-muted/20'>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <label
                key={day}
                className='flex items-center gap-1 text-xs border dark:border-input rounded p-1 justify-center dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-muted/50 cursor-pointer'
              >
                <input
                  type='checkbox'
                  checked={
                    values.schedule.monthlyWorkingDates?.includes(day) || false
                  }
                  onChange={(e) => {
                    const checked = e.target.checked
                    const current = values.schedule.monthlyWorkingDates || []
                    const updated = checked
                      ? [...current, day]
                      : current.filter((d) => d !== day)

                    setFieldTouched('schedule.monthlyWorkingDates', true, false)
                    setFieldValue('schedule.monthlyWorkingDates', updated, true)
                  }}
                  className='accent-black dark:accent-primary'
                />
                {day}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
