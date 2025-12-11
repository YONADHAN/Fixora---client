export type recurrenceType = 'daily' | 'weekly' | 'monthly'
export const recurrenceTypeValues = ['daily', 'weekly', 'monthly'] as const
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
