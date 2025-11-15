'use client'

import { GoogleLogin } from '@react-oauth/google'
import { useGoogleAuthentication } from '@/lib/hooks/useAuth'
import { isGoogleLoginAllowed } from '@/lib/utils/roleGuards'
import { Loader2 } from 'lucide-react'
import { useAppDispatch } from '@/store/store'
import { vendorLogin } from '@/store/slices/vendor.slice'
import { customerLogin } from '@/store/slices/customer.slice'

export default function GoogleLoginButton({ role }: { role: string }) {
  const dispatch = useAppDispatch()
  const { mutateAsync: googleLogin, isPending } = useGoogleAuthentication()

  if (!isGoogleLoginAllowed(role)) {
    return (
      <div className='text-center text-sm text-muted-foreground'>
        Google login is not available for <strong>{role}</strong> accounts.
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-4'>
      {isPending ? (
        <div className='flex items-center justify-center py-2 text-sm text-muted-foreground'>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Connecting to
          Google...
        </div>
      ) : (
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
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

              if (response.data.success) {
                const user = response.data.user
                console.log(' Logged in successfully:', user)

                if (role === 'vendor') {
                  dispatch(vendorLogin(user))
                } else if ((role as 'customer' | 'vendor') === 'customer') {
                  dispatch(customerLogin(user))
                }
                if ((role as 'customer' | 'vendor') === 'customer') {
                  window.location.href = '/'
                  return
                }
                window.location.href = `/${role}/dashboard`
              } else {
                console.error('Login failed:', response.data.message)
              }
            } catch (error) {
              console.error('Google login error:', error)
            }
          }}
          onError={() => console.error(' Google Login Failed')}
          useOneTap={false}
          theme='outline'
          shape='rectangular'
          text='signin_with'
          width='100%'
        />
      )}
    </div>
  )
}
