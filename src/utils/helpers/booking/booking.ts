import { ScheduleDTO } from '@/dtos/service_dto'

export function getAvailableBookingDates(schedule: ScheduleDTO) {
  const {
    visibilityStartDate,
    visibilityEndDate,
    overrideBlock = [],
  } = schedule

  const start = new Date(visibilityStartDate)
  const end = new Date(visibilityEndDate)

  const blockedRanges = overrideBlock.map((b) => ({
    start: new Date(b.startDateTime),
    end: new Date(b.endDateTime),
  }))

  const dates: string[] = []

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const day = new Date(d)

    // Check if blocked
    const isBlocked = blockedRanges.some(
      (block) => day >= block.start && day <= block.end
    )

    if (!isBlocked) {
      dates.push(day.toISOString().split('T')[0])
    }
  }

  return dates
}
export function groupDatesByMonth(dates: string[]) {
  const map: Record<string, string[]> = {}

  dates.forEach((dateStr) => {
    const d = new Date(dateStr)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      '0'
    )}`

    if (!map[key]) map[key] = []
    map[key].push(dateStr)
  })

  return map
}
export function generateTimeSlots(date: string, schedule: ScheduleDTO) {
  const windows = schedule.dailyWorkingWindows
  const duration = schedule.slotDurationMinutes

  const blocked = schedule.overrideBlock || []
  const custom = schedule.overrideCustom || []

  const selectedDate = new Date(date)
  const slots: string[] = []

  windows.forEach((win) => {
    let start = new Date(`${date}T${win.startTime}:00`)
    const end = new Date(`${date}T${win.endTime}:00`)

    while (start < end) {
      const slotStart = new Date(start)

      // Check overrides — BLOCK
      const isBlocked = blocked.some((b) => {
        const bStart = new Date(b.startDateTime)
        const bEnd = new Date(b.endDateTime)
        return slotStart >= bStart && slotStart < bEnd
      })

      if (!isBlocked) {
        slots.push(slotStart.toISOString())
      }

      start = new Date(start.getTime() + duration * 60000)
    }
  })

  return slots
}
