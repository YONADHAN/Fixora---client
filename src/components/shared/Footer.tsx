// 'use client'

// import Link from 'next/link'

// interface FooterLink {
//   label: string
//   href: string
// }

// interface FooterSection {
//   title: string
//   links: FooterLink[]
// }

// interface SiteFooterProps {
//   sections: FooterSection[]
// }

// export default function Footer({ sections }: SiteFooterProps) {
//   return (
//     <footer className="bg-gray-950 text-gray-300">
//       <div className="mx-auto max-w-7xl px-6 py-12">

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

//           {/* Brand column */}
//           <div>
//             <h2 className="text-2xl font-bold text-white">Fixora</h2>
//             <p className="mt-3 text-sm">
//               Your trusted partner for home and office services.
//             </p>
//           </div>

//           {/* Dynamic sections */}
//           {sections.map((section) => (
//             <div key={section.title}>
//               <h3 className="text-lg font-semibold text-white mb-3">
//                 {section.title}
//               </h3>
//               <ul className="space-y-3 text-sm">
//                 {section.links.map((link) => (
//                   <li key={link.href}>
//                     <Link
//                       href={link.href}
//                       className="hover:text-white transition-colors"
//                     >
//                       {link.label}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}

//         </div>

//         <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs">
//           © {new Date().getFullYear()} Fixora. All rights reserved.
//         </div>

//       </div>
//     </footer>
//   )
// }





'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface FooterLink {
  label: string
  href: string
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

interface ServiceCategory {
  serviceCategoryId: string
  name: string
  description: string
  bannerImage: string
}

interface CategoryApiResponse {
  success: boolean
  message: string
  data: {
    data: ServiceCategory[]
  }
}

interface SiteFooterProps {
  sections: FooterSection[]
}

export default function Footer({ sections }: SiteFooterProps) {
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    const fetchCategories = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL

        if (!baseUrl) {
          throw new Error('API URL is not configured')
        }

        const response = await fetch(
          `${baseUrl.replace(/\/$/, '')}/api/v1/customer/service_category`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch service categories')
        }

        const result: CategoryApiResponse = await response.json()

        if (result.success) {
          setCategories(result.data.data)
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Footer categories error:', error)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchCategories()

    return () => controller.abort()
  }, [])

  // Generate category navigation links
  const categoryLinks: FooterLink[] = categories.map((category) => ({
    label: category.name,
    href: `/customer/service_category/${category.serviceCategoryId}`,
  }))

  // Replace the Explore Services section with API data
  const footerSections = sections.map((section) => {
    if (section.title.toLowerCase() === 'explore services') {
      return {
        ...section,
        links: categoryLinks,
      }
    }

    return section
  })

  // Add Explore Services if it doesn't exist in config
  const hasExploreServices = footerSections.some(
    (section) => section.title.toLowerCase() === 'explore services'
  )

  if (!hasExploreServices) {
    footerSections.splice(1, 0, {
      title: 'Explore Services',
      links: categoryLinks,
    })
  }

  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand column */}
          <div>
            <h2 className="text-2xl font-bold text-white">Fixora</h2>
            <p className="mt-3 text-sm">
              Your trusted partner for home and office services.
            </p>
          </div>

          {/* Dynamic sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold text-white mb-3">
                {section.title}
              </h3>

              <ul className="space-y-3 text-sm">
                {section.title.toLowerCase() === 'explore services' &&
                  loading && (
                    <li className="text-gray-500">
                      Loading services...
                    </li>
                  )}

                {!loading && section.links.length === 0 &&
                  section.title.toLowerCase() === 'explore services' && (
                    <li className="text-gray-500">
                      No services available
                    </li>
                  )}

                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs">
          © {new Date().getFullYear()} Fixora. All rights reserved.
        </div>

      </div>
    </footer>
  )
}
