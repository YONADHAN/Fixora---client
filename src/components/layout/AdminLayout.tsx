
'use client'

import { useSelector } from 'react-redux'
import { usePathname } from 'next/navigation'

import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import { RootState } from '@/store/store'

import {
  adminFooterConfig,
  adminPublicFooterConfig,
} from '../data/footer.config'

const PUBLIC_ADMIN_PATHS = [
  '/admin/signin',
  '/admin/forgot-password',
]

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  const admin = useSelector(
    (state: RootState) => state.admin.admin
  )

  const isAuthenticated = !!admin

  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some(
    (path) =>
      pathname === path || pathname.startsWith(`${path}/`)
  )

  const footerConfig =
    isPublicAdminPath && !isAuthenticated
      ? adminPublicFooterConfig
      : adminFooterConfig

  return (
    <section className="min-h-screen flex flex-col">
      <Navbar
        role="admin"
        isAuthenticated={isAuthenticated}
      />

      <main className="flex-1">
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
// import { adminFooterConfig} from '../data/footer.config'

// export default function AdminLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   const admin = useSelector((state: RootState) => state.admin.admin)
//   const isAuthenticated = !!admin
//   return (
//     <section lang='en' className='min-h-screen flex flex-col bg-gray-50/50'>
//       <Navbar role='admin' isAuthenticated={isAuthenticated} />
//       <main className='flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
//         {children}
//       </main>
//       <Footer sections={adminFooterConfig.sections}/>
//     </section>
//   )
// }
