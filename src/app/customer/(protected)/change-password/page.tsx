'use client'

import ChangePasswordForm from '@/components/shared-ui/forms/change-password/change-password-form'
import { useChangeCustomerPassword } from '@/lib/hooks/useCustomer'

const ChangePasswordPage = () => {
  const { mutate, isPending, isSuccess, isError } = useChangeCustomerPassword()

  const handleSubmit = (form: {
    currentPassword: string
    newPassword: string
  }) => {
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
        <p className='text-green-600 mt-2'>Password changed successfully ✅</p>
      )}
      {isError && <p className='text-red-600 mt-2'>Invalid passwords</p>}
    </div>
  )
}

export default ChangePasswordPage
