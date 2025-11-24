import * as Yup from 'yup'
import { passwordRule } from '../common/password-schema'

export const resetPasswordSchema = Yup.object({
  newPassword: passwordRule.label('New Password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
    .required('Confirm password is required'),
})
