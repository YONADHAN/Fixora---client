



'use client'

import { GoogleLogin } from '@react-oauth/google'
import { useGoogleAuthentication } from '@/lib/hooks/useAuth'
import { isGoogleLoginAllowed } from '@/lib/utils/roleGuards'
import { Loader2 } from 'lucide-react'
import { useAppDispatch } from '@/store/store'
import { vendorLogin } from '@/store/slices/vendor.slice'
import { customerLogin } from '@/store/slices/customer.slice'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AxiosError } from 'axios'

export default function GoogleLoginButton({ role }: { role: string }) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { mutateAsync: googleLogin, isPending } = useGoogleAuthentication()

  if (!isGoogleLoginAllowed(role)) {
    return (
      <div className='text-center text-sm text-muted-foreground'>
        Google login is not available for <strong>{role}</strong> accounts.
      </div>
    )
  }

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const credential = credentialResponse.credential
      if (!credential) {
        console.error('No credential returned from Google')
        return
      }

      const response = await googleLogin({
        credential,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        role,
      })

      if (!response.data.success) {
        console.error('Login failed:', response.data.message)
        return
      }

      const user = response.data.user

      // 🔹 Vendor flow
      if (role === 'vendor') {
        dispatch(vendorLogin(user))

        if (user.isVerified?.status !== 'accepted') {
          router.replace('/vendor/verification')
          return
        }

        router.replace('/vendor/dashboard')
        return
      }


      if (role as "customer" | "vendor" === 'customer') {
        dispatch(customerLogin(user))
        router.replace('/')
        return
      }

    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Google login error:', JSON.stringify(error))
        toast.error(error?.response?.data?.message)
      }

    }
  }

  return (
    <div className='grid grid-cols-1 gap-4'>
      {isPending ? (
        <div className='flex items-center justify-center py-2 text-sm text-muted-foreground'>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Connecting to Google...
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.error('Google Login Failed')}
          useOneTap={false}
          theme='outline'
          shape='rectangular'
          text='signin_with'
          //width='100%'
          width={310}

        />
      )}
    </div>
  )
}
