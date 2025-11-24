import * as yup from 'yup'

export const emailSchema = yup.object({
  email: yup
    .string()
    .email('Invalid Email format')
    .required('Email is required'),
})
