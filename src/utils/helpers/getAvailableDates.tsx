import { ServiceSchedule } from '../constants/constants'

export function getAvailableDates(schedule: ServiceSchedule) {
  if (!schedule) return {}

  if (!schedule.visibilityStartDate || !schedule.visibilityEndDate) return {}

  const start = new Date(schedule.visibilityStartDate)
  const end = new Date(schedule.visibilityEndDate)

  const holidays = (schedule.holidayDates || []).map(
    (d) => new Date(d).toISOString().split('T')[0]
  )

  const recurrence = schedule.recurrenceType
  const weekly = schedule.weeklyWorkingDays ?? []
  const monthly = schedule.monthlyWorkingDates ?? []

  const result: Record<string, string[]> = {}

  const current = new Date(start)

  while (current <= end) {
    const iso = current.toISOString().split('T')[0]
    const day = current.getDay()
    const dateNum = current.getDate()

    if (holidays.includes(iso)) {
      current.setDate(current.getDate() + 1)
      continue
    }

    let shouldInclude = false

    if (recurrence === 'daily') shouldInclude = true
    if (recurrence === 'weekly' && weekly.includes(day)) shouldInclude = true
    if (recurrence === 'monthly' && monthly.includes(dateNum))
      shouldInclude = true

    if (shouldInclude) {
      const key = `${current.getFullYear()}-${current.getMonth() + 1}`
      if (!result[key]) result[key] = []
      result[key].push(iso)
    }

    current.setDate(current.getDate() + 1)
  }

  return result
}
