export type recurrenceType = 'daily' | 'weekly' | 'monthly'
export type RecurrenceType = 'daily' | 'weekly' | 'monthly'

export interface ServiceSchedule {
  visibilityStartDate?: Date
  visibilityEndDate?: Date

  workStartTime?: string
  workEndTime?: string

  slotDurationMinutes?: number
  recurrenceType?: recurrenceType

  weeklyWorkingDays?: number[]
  monthlyWorkingDates?: number[]
  holidayDates?: Date[]
}
