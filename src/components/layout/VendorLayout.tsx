
'use client'

import { useSelector } from 'react-redux'
import { usePathname } from 'next/navigation'

import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import { RootState } from '@/store/store'
import {
  clientFooterConfig,
  vendorFooterConfig,
} from '../data/footer.config'

const PUBLIC_VENDOR_PATHS = [
  '/vendor/signin',
  '/vendor/signup',
]

export default function VendorLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  const vendor = useSelector(
    (state: RootState) => state.vendor.vendor
  )

  const isAuthenticated = !!vendor

  const isPublicVendorPath = PUBLIC_VENDOR_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )

  // Logged-out users on signin/signup use the client footer.
  const footerConfig =
    isPublicVendorPath && !isAuthenticated
      ? clientFooterConfig
      : vendorFooterConfig

  return (
    <section
      lang="en"
      className="min-h-screen flex flex-col bg-gray-50/50"
    >
      <Navbar
        role="vendor"
        isAuthenticated={isAuthenticated}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <Footer sections={footerConfig.sections} />
    </section>
  )
}





// 'use client'
// import { useSelector } from 'react-redux'

// import Navbar from '../shared/Navbar'
// import Footer from '../shared/Footer'
// import { RootState } from '@/store/store'
// import { vendorFooterConfig } from '../data/footer.config'

// export default function VendorLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   const vendor = useSelector((state: RootState) => state.vendor.vendor)
//   const isAuthenticated = !!vendor
//   return (
//     <section lang='en' className='min-h-screen flex flex-col bg-gray-50/50'>
//       <Navbar role='vendor' isAuthenticated={isAuthenticated} />
//       <main className='flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
//         {children}
//       </main>
//       <Footer sections={vendorFooterConfig.sections} />
//     </section>
//   )
// }
