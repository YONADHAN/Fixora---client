import * as Yup from 'yup'

export const passwordRule = Yup.string()
  .min(8, 'Password must be at least 8 characters long')
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .matches(/[0-9]/, 'Password must contain at least one number')
  .matches(/[@$!%*?&]/, 'Password must contain at least one special character')
  .required('Password is required')
