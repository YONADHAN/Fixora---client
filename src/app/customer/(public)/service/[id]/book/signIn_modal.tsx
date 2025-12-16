'use client'

import { LoginForm } from '@/components/shared-ui/login/login-form'
import type { LoginFormData } from '@/lib/schemas/loginSchema'
import { useSignin } from '@/lib/hooks/useAuth'
import { useAppDispatch } from '@/store/store'
import { customerLogin } from '@/store/slices/customer.slice'
import { toast } from 'sonner'
import { AxiosError } from 'axios'

type Props = {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function SignInModal({ open, onClose, onSuccess }: Props) {
  const signinMutation = useSignin()
  const dispatch = useAppDispatch()

  if (!open) return null

  const handleLogin = async (data: LoginFormData) => {
    try {
      const response = await signinMutation.mutateAsync({
        ...data,
        role: 'customer',
      })

      if (response.success) {
        dispatch(customerLogin(response.user))
        toast.success('Login successful')
        onSuccess()
      } else {
        toast.error(response.message || 'Login failed')
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Login failed')
      } else {
        toast.error('Login failed')
      }
    }
  }

  return (
    <div
      className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center '
      onClick={onClose}
    >
      <div
        className='bg-background rounded-lg w-full max-w-md p-4'
        onClick={(e) => e.stopPropagation()}
      >
        <LoginForm role='customer' onSubmit={handleLogin} variant='modal' />
      </div>
    </div>
  )
}
