import { ServiceSchedule } from '../constants/constants'

export function generateSlotsForDate(
  date: Date,
  schedule: ServiceSchedule
): Date[] {
  if (!schedule) return []

  const holidays = (schedule.holidayDates || []).map(
    (d) => new Date(d).toISOString().split('T')[0]
  )
  const iso = date.toISOString().split('T')[0]

  if (holidays.includes(iso)) return []

  const { workStartTime, workEndTime, slotDurationMinutes } = schedule

  if (!workStartTime || !workEndTime || !slotDurationMinutes) return []

  const slots: Date[] = []

  const [sh, sm] = workStartTime.split(':').map(Number)
  const [eh, em] = workEndTime.split(':').map(Number)

  const start = new Date(date)
  start.setHours(sh, sm, 0, 0)

  const end = new Date(date)
  end.setHours(eh, em, 0, 0)

  let pointer = new Date(start)

  while (pointer < end) {
    const next = new Date(pointer.getTime() + slotDurationMinutes * 60000)
    if (next > end) break

    slots.push(new Date(pointer))
    pointer = next
  }

  return slots
}
