'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useSubServiceCategoriesBasedOnServiceCategoryId } from '@/lib/hooks/useSubServiceCategory'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Pagination } from '@/components/shared-ui/resusable_components/pagination/pagination'

export default function ServiceCategoryDetailsPage() {
  const { id: serviceCategoryId } = useParams()

  // Pagination + search
  const [page, setPage] = useState(1)
  const [limit] = useState(3)
  const [search, setSearch] = useState('')

  const { data, isLoading, isError } =
    useSubServiceCategoriesBasedOnServiceCategoryId({
      serviceCategoryId: String(serviceCategoryId),
      page: String(page),
      limit: String(limit),
      search,
    })

  console.log('API FULL RESPONSE:', JSON.stringify(data, null, 2))

  const subs = data?.data || []
  const totalPages = data?.totalPages || 0
  const currentPage = data?.currentPage || 1

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-3xl font-semibold tracking-wide'>
        Sub-Service Categories
      </h1>

      {/* Search Box */}
      <div className='flex gap-2 max-w-md'>
        <Input
          placeholder='Search sub-services...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={() => setPage(1)}>Search</Button>
      </div>

      {/* Loading */}
      {isLoading && (
        <p className='text-muted-foreground'>Fetching categories…</p>
      )}

      {/* Error */}
      {isError && (
        <p className='text-red-500'>Unable to load categories right now.</p>
      )}

      {/* List */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
        {subs.map((sub) => (
          <Card
            key={sub.subServiceCategoryId}
            className='
        group 
        border rounded-xl overflow-hidden 
        shadow-sm 
        hover:shadow-lg hover:-translate-y-1 
        transition-all duration-300
      '
          >
            {/* Image */}
            <div className='relative w-full h-48 bg-gray-100'>
              {sub.bannerImage && (
                <Image
                  src={sub.bannerImage}
                  alt={sub.name}
                  fill
                  className='object-contain transition-transform duration-300 group-hover:scale-105'
                />
              )}
            </div>

            {/* Content */}
            <CardContent className='p-4'>
              <h3 className='text-xl font-semibold mb-2'>{sub.name}</h3>
              <p className='text-sm text-gray-600 leading-relaxed line-clamp-2'>
                {sub.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  )
}
