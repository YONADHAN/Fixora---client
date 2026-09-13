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
import { Search, Loader2, AlertCircle, ArrowRight } from 'lucide-react'

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <EmptySubServices />
      </div>
    )
  }

  const navigateToSearchPage = (subCatId: string) => {
    router.push(`/customer/sub_service_category/${subCatId}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mt-6 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Sub-Service Categories
          </h1>
          <p className="text-slate-600 text-lg">
            Discover and book the perfect service tailored to your specific needs.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto">
          <div className="relative flex items-center bg-white rounded-xl shadow-sm border border-slate-200 focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-100 transition-all duration-200">
            <div className="pl-4 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <Input
              placeholder="Search sub-services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border-0 shadow-none focus-visible:ring-0 text-slate-900 placeholder:text-slate-400 h-14 bg-transparent text-base"
            />
            <div className="pr-2">
              <Button 
                onClick={() => setPage(1)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 h-10 rounded-lg font-medium transition-colors"
              >
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
            <p className="text-slate-500 font-medium">Loading categories...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4 bg-white rounded-2xl border border-red-100 max-w-xl mx-auto shadow-sm">
            <AlertCircle className="w-10 h-10 text-red-500" />
            <p className="text-red-700 font-medium">Unable to load categories right now.</p>
            <Button variant="outline" onClick={() => window.location.reload()} className="mt-2">
              Try Again
            </Button>
          </div>
        )}

        {/* Empty Search State */}
        {!isLoading && !isError && subs.length === 0 && isSearchActive && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4 bg-white rounded-2xl border border-slate-200 max-w-xl mx-auto shadow-sm">
            <Search className="w-10 h-10 text-slate-300" />
            <p className="text-slate-600 text-center px-6">
              We couldn't find any services matching "<span className="text-slate-900 font-semibold">{debouncedSearch}</span>".<br/>Try adjusting your search terms.
            </p>
            <Button variant="outline" onClick={() => setSearch('')} className="mt-4">
              Clear Search
            </Button>
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && !isError && subs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subs.map((sub: any) => (
              <Card
                key={sub.subServiceCategoryId}
                onClick={() => navigateToSearchPage(sub.subServiceCategoryId)}
                className="group border border-slate-200 bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full"
              >
                <div className="relative w-full h-56 bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-center overflow-hidden">
                  {sub.bannerImage ? (
                    <Image
                      src={sub.bannerImage}
                      alt={sub.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-slate-400 font-medium">No Image Available</div>
                  )}
                </div>

                <CardContent className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors line-clamp-1">
                    {sub.name}
                  </h3>
                  <p className="text-slate-500 leading-relaxed line-clamp-2 flex-1 text-sm">
                    {sub.description}
                  </p>
                  
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-slate-700 font-medium text-sm transition-colors group-hover:text-slate-900">
                      View Details
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pt-8 pb-12 flex justify-center">
            <div className="bg-white px-2 py-1 rounded-xl shadow-sm border border-slate-200">
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

