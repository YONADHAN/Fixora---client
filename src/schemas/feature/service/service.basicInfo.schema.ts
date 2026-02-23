import * as Yup from 'yup'

export const serviceBasicInfoSchema = Yup.object({
  name: Yup.string().trim().required('Service name is required'),

  description: Yup.string()
    .trim()
    .min(10, 'Minimum 10 characters')
    .required('Description is required'),

  subServiceCategoryId: Yup.string()
    .trim()
    .required('Sub category is required'),
})
