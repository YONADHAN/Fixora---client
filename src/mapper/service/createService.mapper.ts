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

  fd.append('serviceId', values.serviceId)
  fd.append('subServiceCategoryId', values.subServiceCategoryId)
  fd.append('name', values.name)

  if (values.description) {
    fd.append('description', values.description)
  }

  if (values.serviceVariants) {
    fd.append('serviceVariants', JSON.stringify(values.serviceVariants))
  }

  fd.append('pricing', JSON.stringify(values.pricing))

  fd.append(
    'schedule',
    JSON.stringify({
      ...values.schedule,
      visibilityStartDate: values.schedule.visibilityStartDate?.toISOString(),
      visibilityEndDate: values.schedule.visibilityEndDate?.toISOString(),

      overrideBlock: values.schedule.overrideBlock?.map((b) => ({
        ...b,
        startDateTime: b.startDateTime.toISOString(),
        endDateTime: b.endDateTime.toISOString(),
      })),

      overrideCustom: values.schedule.overrideCustom?.map((c) => ({
        ...c,
        startDateTime: c.startDateTime.toISOString(),
        endDateTime: c.endDateTime.toISOString(),
      })),
    })
  )

  values.images.forEach((file) => {
    fd.append('files', file)
  })

  return fd
}
