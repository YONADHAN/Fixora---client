export interface RequestGetAvalilableSlotsDTO {
  serviceId: string
  month: string
  year: string
}

export interface ResponseGetAvailableSlotsDTO {
  [date: string]: {
    start: string
    end: string
  }[]
}
