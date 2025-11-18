'use client'

import ChangePasswordForm from '@/components/shared-ui/forms/change-password/change-password-form'
import { useChangeCustomerPassword } from '@/lib/hooks/useCustomer'
import { toast } from 'sonner'

const ChangePasswordPage = () => {
  const { mutate, isPending, isSuccess, isError } = useChangeCustomerPassword()

  const handleSubmit = (form: {
    currentPassword: string
    newPassword: string
  }) => {
    const current = form.currentPassword.trim()
    const next = form.newPassword.trim()

    if (!current || !next) {
      toast.error('Please enter both passwords.')
      return
    }

    if (current === next) {
      toast.error('New password cannot be the same as current password.')
      return
    }

    if (next.length < 6) {
      toast.error('New password must be at least 6 characters.')
      return
    }

    const strongPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{6,}$/
    if (!strongPassword.test(next)) {
      toast.error(
        'Password must include uppercase, lowercase, number, and special character.'
      )
      return
    }
    mutate({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    })
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 text-black '>
      <ChangePasswordForm onSubmit={handleSubmit} />
      {isPending && <p className='text-blue-600 mt-2'>Updating password...</p>}
      {isSuccess && (
        <p className='text-green-600 mt-2'>Password changed successfully </p>
      )}
      {isError && <p className='text-red-600 mt-2'>Invalid passwords</p>}
    </div>
  )
}

export default ChangePasswordPage
