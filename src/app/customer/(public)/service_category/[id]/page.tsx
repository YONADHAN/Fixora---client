'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useSubServiceCategoriesBasedOnServiceCategoryId } from '@/lib/hooks/useSubServiceCategory'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Pagination } from '@/components/shared-ui/resusable_components/pagination/pagination'
import EmptySubServices from '@/components/pages/service-category/Empty-subservices'
import { useRouter } from 'next/navigation'

export default function ServiceCategoryDetailsPage() {
  const router = useRouter()
  const { id: serviceCategoryId } = useParams()

  const [page, setPage] = useState(1)
  const [limit] = useState(3)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const { data, isLoading, isError } =
    useSubServiceCategoriesBasedOnServiceCategoryId({
      serviceCategoryId: String(serviceCategoryId),
      page: String(page),
      limit: String(limit),
      search: debouncedSearch,
    })

  console.log('API FULL RESPONSE:', JSON.stringify(data, null, 2))

  const subs = data?.data || []
  const totalPages = data?.totalPages || 0
  const currentPage = data?.currentPage || 1

  const isSearchActive = debouncedSearch.trim().length > 0

  if (subs.length === 0 && !isLoading && !isError && !isSearchActive) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <EmptySubServices />
      </div>
    )
  }

  const navigateToSearchPage = (subCatId: string) => {
    router.push(`/customer/sub_service_category/${subCatId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-6 max-w-3xl mx-auto mt-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-950 tracking-tight">
            Sub-Service <span className="text-blue-600">Categories</span>
          </h1>
          <p className="text-lg text-blue-900/60 font-medium">
            Discover and book the perfect service tailored to your specific needs.
          </p>
        </div>

        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full transition-all duration-500 group-hover:bg-blue-400/30"></div>
          <div className="relative flex items-center bg-white p-2 rounded-full shadow-lg border border-blue-100 transition-all duration-300 focus-within:ring-4 focus-within:ring-blue-100">
            <div className="pl-5 pr-3 text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <Input
              placeholder="Search sub-services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border-0 shadow-none focus-visible:ring-0 text-blue-950 placeholder:text-blue-300 text-lg bg-transparent py-6"
            />
            <Button 
              onClick={() => setPage(1)}
              className="rounded-full px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold transition-colors shadow-md hover:shadow-lg ml-2"
            >
              Search
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <svg className="w-10 h-10 text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-blue-900/60 font-medium animate-pulse">Fetching categories…</p>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-red-50/50 rounded-3xl border border-red-100 max-w-2xl mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p className="text-red-600 font-medium text-lg">Unable to load categories right now.</p>
            <Button variant="outline" onClick={() => window.location.reload()} className="border-red-200 text-red-600 hover:bg-red-50 mt-2">
              Try Again
            </Button>
          </div>
        )}

        {!isLoading && !isError && subs.length === 0 && isSearchActive && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4 bg-white/60 backdrop-blur-md rounded-[2rem] border border-blue-100 max-w-2xl mx-auto shadow-sm mt-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-300">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <p className="text-blue-900/70 font-medium text-lg text-center px-4">
              We couldn't find any services matching "<span className="text-blue-600 font-semibold">{debouncedSearch}</span>".<br/>Try searching with different keywords.
            </p>
            <Button variant="outline" onClick={() => setSearch('')} className="mt-4 border-blue-200 text-blue-600 hover:bg-blue-50 rounded-full px-8">
              Clear Search
            </Button>
          </div>
        )}

        {!isLoading && !isError && subs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10 mt-8">
            {subs.map((sub) => (
              <Card
                key={sub.subServiceCategoryId}
                onClick={() => navigateToSearchPage(sub.subServiceCategoryId)}
                className="group border-0 bg-white/60 backdrop-blur-md rounded-[2rem] overflow-hidden shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col h-full"
              >
                <div className="relative w-full h-64 bg-gradient-to-br from-blue-50/50 to-blue-100/30 p-8 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors duration-500 z-10"></div>
                  {sub.bannerImage ? (
                    <Image
                      src={sub.bannerImage}
                      alt={sub.name}
                      fill
                      className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-100/50 rounded-2xl flex items-center justify-center">
                      <span className="text-blue-300 font-medium">No image</span>
                    </div>
                  )}
                </div>

                <CardContent className="p-8 flex-1 flex flex-col bg-white">
                  <h3 className="text-2xl font-bold text-blue-950 mb-4 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                    {sub.name}
                  </h3>
                  <p className="text-base text-blue-900/70 leading-relaxed line-clamp-3 flex-1">
                    {sub.description}
                  </p>
                  
                  <div className="mt-8 pt-6 border-t border-blue-50 flex items-center justify-between">
                    <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider group-hover:tracking-widest transition-all duration-300">
                      Explore Services
                    </span>
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                      <svg className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pt-12 pb-8 flex justify-center">
            <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-blue-50">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
