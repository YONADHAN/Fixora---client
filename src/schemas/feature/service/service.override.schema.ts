import * as Yup from 'yup'

export const serviceOverridesSchema = Yup.object({
  schedule: Yup.object({
    overrideBlock: Yup.array()
      .of(
        Yup.object({
          startDateTime: Yup.date().required(),
          endDateTime: Yup.date()
            .min(Yup.ref('startDateTime'), 'End must be after start')
            .required(),
          reason: Yup.string().optional(),
        })
      )
      .optional(),

    overrideCustom: Yup.array()
      .of(
        Yup.object({
          startDateTime: Yup.date().required(),
          endDateTime: Yup.date()
            .min(Yup.ref('startDateTime'), 'End must be after start')
            .required(),
          startTime: Yup.string().optional(),
          endTime: Yup.string().optional(),
        })
      )
      .optional(),
  }),
})
