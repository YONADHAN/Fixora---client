'use client'

import { useSelector } from 'react-redux'
import { usePathname } from 'next/navigation'

import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { RootState } from '@/store/store'
import { clientFooterConfig, customerFooterConfig } from '@/components/data/footer.config'

const PUBLIC_CUSTOMER_PATHS = [
  '/customer/about_us',
  '/customer/service_category',
  '/customer/sub_service_category',
  '/customer/service',
  '/customer/signin',
  '/customer/signup'
]

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const customer = useSelector((state: RootState) => state.customer.customer)
  const isAuthenticated = !!customer

  const isPublicCustomerPath = PUBLIC_CUSTOMER_PATHS.some((p) =>
    pathname.startsWith(p)
  )

  const isTrulyPublicPath =
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/vendor') &&
    !pathname.startsWith('/customer')

  const showSharedLayout =
    isTrulyPublicPath || (isPublicCustomerPath && !isAuthenticated)

  const footerConfig = isAuthenticated ? customerFooterConfig : clientFooterConfig

  return (
    <>
      {showSharedLayout && (
        <Navbar role='customer' isAuthenticated={isAuthenticated} />
      )}

      <main>{children}</main>

      {showSharedLayout && (
        <Footer sections={footerConfig.sections} />
      )}
    </>
  )
}