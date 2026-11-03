'use client'

import { useSelector } from 'react-redux'
import { usePathname } from 'next/navigation'

import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import { RootState } from '@/store/store'
import AIChatBot from '../chat/AIChatBot'
import { customerFooterConfig } from '../data/footer.config'

const PUBLIC_CUSTOMER_PATHS = [
  '/customer/about_us',
  '/customer/service_category',
  '/customer/sub_service_category',
  '/customer/service',
  '/customer/signin',
  '/customer/signup'
]

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const customer = useSelector((state: RootState) => state.customer.customer)
  const isAuthenticated = !!customer

  const isPublicPath = PUBLIC_CUSTOMER_PATHS.some((p) =>
    pathname.startsWith(p)
  )

  if (isPublicPath && !isAuthenticated) {
    return <>{children}</>
  }

  return (
    <section lang='en'>
      <Navbar role='customer' isAuthenticated={isAuthenticated} />
      {children}
      <AIChatBot />
      <Footer sections={customerFooterConfig.sections} />
    </section>
  )
}
