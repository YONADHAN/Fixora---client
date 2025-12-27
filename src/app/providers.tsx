'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'

import { queryClient } from '@/lib/queryClient'
import StoreProvider from '@/store/StoreProvider'
import { SocketProvider } from '@/providers/SocketProvider'
import ClientLayout from '@/components/layout/shared/ClientLayout'

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StoreProvider>
      <SocketProvider>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          <QueryClientProvider client={queryClient}>
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
            >
              <Toaster position='top-right' />
              <ClientLayout>{children}</ClientLayout>
            </ThemeProvider>
          </QueryClientProvider>
        </GoogleOAuthProvider>
      </SocketProvider>
    </StoreProvider>
  )
}
