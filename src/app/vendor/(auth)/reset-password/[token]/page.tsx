'use client'
import ResetPassword from '@/components/shared-ui/reset-password/page'
import { toast } from 'sonner'
import { useResetPassword } from '@/lib/hooks/useAuth'
import { useParams } from 'next/navigation'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
const Page = () => {
  const resetPassword = useResetPassword()
  const { token } = useParams()
  const router = useRouter()
  const handleSubmit = async ({
    newPassword,
    confirmPassword,
  }: {
    newPassword: string
    confirmPassword: string
  }) => {
    if (newPassword !== confirmPassword) {
      toast.error('New Password and Confirm Password must match')
      return
    }

    try {
      const response = await resetPassword.mutateAsync({
        password: newPassword,
        token: token as string,
        role: 'vendor',
      })

      toast.success('Password reset successful!')
      console.log(response.data)
      router.push('/vendor/signin')
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message)
      }
    }
  }

  return <ResetPassword role='vendor' handleSubmit={handleSubmit} />
}

export default Page
