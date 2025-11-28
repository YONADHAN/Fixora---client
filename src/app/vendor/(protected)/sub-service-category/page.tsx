'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  ColumnDefinition,
  ResponsiveTable,
} from '@/components/shared-ui/resusable_components/table/TableWithPagination'
import { useGetVendorSubServiceCategories } from '@/lib/hooks/useSubServiceCategory'
import { SubServiceCategoryItem } from '@/dtos/sub_service_categories_dto'

export default function VendorSubServiceCategoryPage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(3)
  const [search, setSearch] = useState('')

  const { data, isLoading, refetch } = useGetVendorSubServiceCategories({
    page,
    limit,
    search,
  })

  const formattedData =
    data?.data.map((item) => ({
      id: item.subServiceCategoryId,
      ...item,
    })) ?? []

  const columns: ColumnDefinition<SubServiceCategoryItem & { id: string }>[] = [
    {
      key: 'name',
      header: 'Sub Service Name',
    },
    {
      key: 'serviceCategoryName',
      header: 'Parent Category',
    },
    {
      key: 'bannerImage',
      header: 'Image',
      render: (item: SubServiceCategoryItem) => (
        <Image
          src={item.bannerImage}
          width={50}
          height={50}
          alt='sub-service'
          className='rounded-md border'
        />
      ),
    },
    {
      key: 'isActive',
      header: 'Active Status',
      render: (item: SubServiceCategoryItem) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            item.isActive === 'active'
              ? 'bg-green-100 text-green-600'
              : 'bg-red-100 text-red-600'
          }`}
        >
          {item.isActive}
        </span>
      ),
    },
    {
      key: 'verification',
      header: 'Verification',
      render: (item: SubServiceCategoryItem) => {
        const color =
          item.verification === 'accepted'
            ? 'bg-green-100 text-green-700'
            : item.verification === 'pending'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-red-100 text-red-700'

        return (
          <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>
            {item.verification}
          </span>
        )
      },
    },
  ] as const

  return (
    <div className='p-6'>
      <ResponsiveTable
        title='My Sub-Service Categories'
        data={formattedData}
        loading={isLoading}
        columns={columns}
        //actions={() => null}
        currentPage={data?.currentPage ?? 1}
        totalPages={data?.totalPages ?? 1}
        onPageChange={(newPage) => {
          setPage(newPage)
          refetch()
        }}
        searchTerm={search}
        onSearchTermChange={(e) => setSearch(e.target.value)}
        onSearchClick={() => refetch()}
        headerActions={
          <Link href='/vendor/sub-service-category/add'>
            <Button>Add New Sub Service</Button>
          </Link>
        }
      />
    </div>
  )
}
