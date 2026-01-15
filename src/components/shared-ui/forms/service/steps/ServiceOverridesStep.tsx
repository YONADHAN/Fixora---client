import { useState } from 'react'
import { useFormikContext, FormikErrors } from 'formik'
import { IServiceFormValues } from '@/types/service_feature/service.types'

export default function ServiceOverridesStep() {
  const { values, setFieldValue, touched, errors, setFieldTouched } =
    useFormikContext<IServiceFormValues>()

  const scheduleErrors = errors.schedule as
    | FormikErrors<IServiceFormValues['schedule']>
    | undefined

  // ---------------- BLOCK OVERRIDES ----------------
  const [blockStart, setBlockStart] = useState('')
  const [blockEnd, setBlockEnd] = useState('')
  const [blockReason, setBlockReason] = useState('')
  const [blockError, setBlockError] = useState<string | null>(null)

  // ---------------- CUSTOM OVERRIDES ----------------
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  const [customStartTime, setCustomStartTime] = useState('')
  const [customEndTime, setCustomEndTime] = useState('')
  const [customError, setCustomError] = useState<string | null>(null)

  const toTime = (dt: string) => new Date(dt).getTime()

  // ✅ ADD BLOCK OVERRIDE
  const addBlockOverride = () => {
    setBlockError(null)

    if (!blockStart || !blockEnd) {
      setBlockError('Start and end date-time required')
      return
    }

    const start = toTime(blockStart)
    const end = toTime(blockEnd)

    if (start >= end) {
      setBlockError('Start must be before end')
      return
    }

    const existing = values.schedule.overrideBlock || []

    const overlaps = existing.some((o) => {
      const s = new Date(o.startDateTime).getTime()
      const e = new Date(o.endDateTime).getTime()
      return start < e && end > s
    })

    if (overlaps) {
      setBlockError('This block overlaps with an existing block')
      return
    }

    const updated = [
      ...existing,
      {
        startDateTime: new Date(blockStart),
        endDateTime: new Date(blockEnd),
        reason: blockReason || undefined,
      },
    ]

    setFieldTouched('schedule.overrideBlock', true, false)
    setFieldValue('schedule.overrideBlock', updated, true)

    setBlockStart('')
    setBlockEnd('')
    setBlockReason('')
  }

  const removeBlockOverride = (i: number) => {
    const updated =
      values.schedule.overrideBlock?.filter((_, idx) => idx !== i) || []
    setFieldValue('schedule.overrideBlock', updated, true)
  }

  // ✅ ADD CUSTOM OVERRIDE
  const addCustomOverride = () => {
    setCustomError(null)

    if (!customStart || !customEnd) {
      setCustomError('Start and end date-time required')
      return
    }

    const start = toTime(customStart)
    const end = toTime(customEnd)

    if (start >= end) {
      setCustomError('Start must be before end')
      return
    }

    const existing = values.schedule.overrideCustom || []

    const overlaps = existing.some((o) => {
      const s = new Date(o.startDateTime).getTime()
      const e = new Date(o.endDateTime).getTime()
      return start < e && end > s
    })

    if (overlaps) {
      setCustomError('This custom override overlaps with another')
      return
    }

    const updated = [
      ...existing,
      {
        startDateTime: new Date(customStart),
        endDateTime: new Date(customEnd),
        startTime: customStartTime || undefined,
        endTime: customEndTime || undefined,
      },
    ]

    setFieldTouched('schedule.overrideCustom', true, false)
    setFieldValue('schedule.overrideCustom', updated, true)

    setCustomStart('')
    setCustomEnd('')
    setCustomStartTime('')
    setCustomEndTime('')
  }

  const removeCustomOverride = (i: number) => {
    const updated =
      values.schedule.overrideCustom?.filter((_, idx) => idx !== i) || []
    setFieldValue('schedule.overrideCustom', updated, true)
  }

  return (
    <div className='max-w-4xl mx-auto bg-white dark:bg-card border dark:border-border rounded-2xl shadow-sm p-6 space-y-10'>
      {/* ✅ HEADER */}
      <div>
        <h2 className='text-xl font-semibold text-gray-900 dark:text-foreground'>
          Service Overrides
        </h2>
        <p className='text-sm text-gray-500 dark:text-muted-foreground'>
          Temporarily block or customize your service availability.
        </p>
      </div>

      {/* ================= BLOCK OVERRIDES ================= */}
      <div className='border dark:border-border rounded-xl p-6 space-y-4 bg-gray-50 dark:bg-muted/50'>
        <h3 className='font-medium text-gray-900 dark:text-foreground'>Block Service Period</h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <input
            type='datetime-local'
            value={blockStart}
            onChange={(e) => setBlockStart(e.target.value)}
            className='border dark:border-input p-2 rounded-lg w-full bg-transparent dark:bg-background dark:text-foreground focus:ring-2 focus:ring-black dark:focus:ring-white outline-none'
          />

          <input
            type='datetime-local'
            value={blockEnd}
            onChange={(e) => setBlockEnd(e.target.value)}
            className='border dark:border-input p-2 rounded-lg w-full bg-transparent dark:bg-background dark:text-foreground focus:ring-2 focus:ring-black dark:focus:ring-white outline-none'
          />
        </div>

        <input
          type='text'
          placeholder='Reason (optional)'
          value={blockReason}
          onChange={(e) => setBlockReason(e.target.value)}
          className='border dark:border-input p-2 rounded-lg w-full bg-transparent dark:bg-background dark:text-foreground focus:ring-2 focus:ring-black dark:focus:ring-white outline-none'
        />

        <button
          type='button'
          onClick={addBlockOverride}
          className='px-4 py-2 bg-black dark:bg-primary text-white dark:text-primary-foreground rounded-lg hover:bg-gray-900 dark:hover:bg-primary/90'
        >
          Add Block
        </button>

        {blockError && <p className='text-red-500 text-sm'>{blockError}</p>}

        <div className='space-y-2'>
          {values.schedule.overrideBlock?.map((o, i) => (
            <div
              key={i}
              className='flex justify-between items-center bg-white dark:bg-muted border dark:border-border rounded-lg p-3'
            >
              <div className='text-sm dark:text-foreground'>
                <p className='font-medium'>
                  {new Date(o.startDateTime).toLocaleString()} →{' '}
                  {new Date(o.endDateTime).toLocaleString()}
                </p>
                {o.reason && (
                  <p className='text-xs text-gray-500 dark:text-muted-foreground'>{o.reason}</p>
                )}
              </div>

              <button
                type='button'
                onClick={() => removeBlockOverride(i)}
                className='text-xs text-red-600 hover:underline'
              >
                Remove
              </button>
            </div>
          ))}
          {/* ✅ INFO BANNER */}
          <div className='bg-gray-50 dark:bg-muted border dark:border-border rounded-lg p-4 text-sm text-gray-600 dark:text-muted-foreground'>
            💡 <span className='font-medium'>Tip:</span> Block service period is
            means holidays. You can skip this, if you don&apos;t want it now.
          </div>
        </div>
      </div>

      {/* ================= CUSTOM OVERRIDES ================= */}
      <div className='border dark:border-border rounded-xl p-6 space-y-4 bg-gray-50 dark:bg-muted/50'>
        <h3 className='font-medium text-gray-900 dark:text-foreground'>Custom Time Overrides</h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <input
            type='datetime-local'
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className='border dark:border-input p-2 rounded-lg w-full bg-transparent dark:bg-background dark:text-foreground focus:ring-2 focus:ring-black dark:focus:ring-white outline-none'
          />

          <input
            type='datetime-local'
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className='border dark:border-input p-2 rounded-lg w-full bg-transparent dark:bg-background dark:text-foreground focus:ring-2 focus:ring-black dark:focus:ring-white outline-none'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <input
            type='time'
            value={customStartTime}
            onChange={(e) => setCustomStartTime(e.target.value)}
            className='border dark:border-input p-2 rounded-lg w-full bg-transparent dark:bg-background dark:text-foreground focus:ring-2 focus:ring-black dark:focus:ring-white outline-none'
          />
          <input
            type='time'
            value={customEndTime}
            onChange={(e) => setCustomEndTime(e.target.value)}
            className='border dark:border-input p-2 rounded-lg w-full bg-transparent dark:bg-background dark:text-foreground focus:ring-2 focus:ring-black dark:focus:ring-white outline-none'
          />
        </div>

        <button
          type='button'
          onClick={addCustomOverride}
          className='px-4 py-2 bg-black dark:bg-primary text-white dark:text-primary-foreground rounded-lg hover:bg-gray-900 dark:hover:bg-primary/90'
        >
          Add Custom Override
        </button>

        {customError && <p className='text-red-500 text-sm'>{customError}</p>}

        <div className='space-y-2'>
          {values.schedule.overrideCustom?.map((o, i) => (
            <div
              key={i}
              className='flex justify-between items-center bg-white dark:bg-muted border dark:border-border rounded-lg p-3'
            >
              <span className='text-sm font-medium dark:text-foreground'>
                {new Date(o.startDateTime).toLocaleString()} →{' '}
                {new Date(o.endDateTime).toLocaleString()}
              </span>

              <button
                type='button'
                onClick={() => removeCustomOverride(i)}
                className='text-xs text-red-600 hover:underline'
              >
                Remove
              </button>
            </div>
          ))}
          {/* ✅ INFO BANNER */}
          <div className='bg-gray-50 dark:bg-muted border dark:border-border rounded-lg p-4 text-sm text-gray-600 dark:text-muted-foreground'>
            💡 <span className='font-medium'>Tip:</span> You can add additional
            service schedule in this. If you don&apos;t want it now, skip this.
          </div>
        </div>
      </div>
    </div>
  )
}
