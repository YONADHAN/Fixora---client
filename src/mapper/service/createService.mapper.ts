import { CreateServiceDTO } from '@/dtos/service_dto'
import { IServiceFormValues } from '@/types/service_feature/service.types'

export const mapFormToCreateDTO = (
  form: IServiceFormValues
): CreateServiceDTO => {
  return {
    serviceId: form.serviceId,
    subServiceCategoryId: form.subServiceCategoryId,
    name: form.name,
    description: form.description,
    serviceVariants: form.serviceVariants,

    pricing: form.pricing,
    images: form.images,

    schedule: {
      ...form.schedule,

      visibilityStartDate: form.schedule.visibilityStartDate?.toISOString(),

      visibilityEndDate: form.schedule.visibilityEndDate?.toISOString(),

      overrideBlock: form.schedule.overrideBlock?.map((b) => ({
        ...b,
        startDateTime: b.startDateTime.toISOString(),
        endDateTime: b.endDateTime.toISOString(),
      })),

      overrideCustom: form.schedule.overrideCustom?.map((c) => ({
        ...c,
        startDateTime: c.startDateTime.toISOString(),
        endDateTime: c.endDateTime.toISOString(),
      })),
    },
  }
}
export const mapFormToCreateServiceFormData = (
  values: IServiceFormValues
): FormData => {
  const fd = new FormData()

  // ✅ BASIC FIELDS
  fd.append('serviceId', values.serviceId)
  fd.append('subServiceCategoryId', values.subServiceCategoryId)
  fd.append('name', values.name)

  if (values.description) {
    fd.append('description', values.description)
  }

  // ✅ VARIANTS
  if (values.serviceVariants?.length) {
    fd.append('serviceVariants', JSON.stringify(values.serviceVariants))
  }

  // ✅ PRICING
  fd.append('pricing', JSON.stringify(values.pricing))

  // ✅ CLEANED SCHEDULE
  const cleanedSchedule = {
    ...values.schedule,

    visibilityStartDate: values.schedule.visibilityStartDate
      ? new Date(values.schedule.visibilityStartDate).toISOString()
      : undefined,

    visibilityEndDate: values.schedule.visibilityEndDate
      ? new Date(values.schedule.visibilityEndDate).toISOString()
      : undefined,

    dailyWorkingWindows: values.schedule.dailyWorkingWindows.filter(
      (w) => w.startTime && w.endTime
    ),

    overrideBlock: values.schedule.overrideBlock?.map((b) => ({
      ...b,
      startDateTime: new Date(b.startDateTime).toISOString(),
      endDateTime: new Date(b.endDateTime).toISOString(),
    })),

    overrideCustom: values.schedule.overrideCustom?.map((c) => ({
      ...c,
      startDateTime: new Date(c.startDateTime).toISOString(),
      endDateTime: new Date(c.endDateTime).toISOString(),
    })),
  }

  fd.append('schedule', JSON.stringify(cleanedSchedule))

  // ✅ SINGLE IMAGE
  if (values.images?.length === 1 && values.images[0] instanceof File) {
    fd.append('images', values.images[0]) // ✅ IMPORTANT: use "images"
  } else {
    console.error('❌ No valid image selected')
  }

  return fd
}
