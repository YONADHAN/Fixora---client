'use client'

import { useState } from 'react'
import {
  ColumnDefinition,
  ResponsiveTable,
} from '@/components/shared-ui/resusable_components/table/TableWithPagination'
import { useGetAllServices } from '@/lib/hooks/useService'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface ServiceRow {
  id: string
  serviceId: string
  title: string
  description: string
  images: string[]
  isActiveStatusByVendor: boolean
}

export default function AdminServicesPage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(3)
  const [search, setSearch] = useState('')
  const router = useRouter()

  const { data, isLoading } = useGetAllServices({
    page: String(page),
    limit: String(limit),
    search,
  })

  const tableData: ServiceRow[] = (data?.data || []).map((item) => ({
    id: item.serviceId,
    ...item,
  }))

  const columns = [
    { key: 'title', header: 'Title' },
    // { key: 'description', header: 'Description' },
    {
      key: 'images',
      header: 'Image',
      render: (item: ServiceRow) => (
        <img
          src={item.images[0]}
          alt={item.title}
          className='w-14 h-14 rounded-md object-cover'
        />
      ),
    },
    {
      key: 'isActiveStatusByVendor',
      header: 'Status',
      render: (item: ServiceRow) => (
        <span
          className={
            item.isActiveStatusByVendor
              ? 'text-green-600 font-medium'
              : 'text-red-600 font-medium'
          }
        >
          {item.isActiveStatusByVendor ? 'Active' : 'Blocked'}
        </span>
      ),
    },
  ] as ColumnDefinition<ServiceRow>[]

  return (
    <ResponsiveTable<ServiceRow>
      title='All Services'
      data={tableData}
      loading={isLoading}
      columns={columns}
      currentPage={data?.currentPage || page}
      totalPages={data?.totalPages || 1}
      onPageChange={setPage}
      searchTerm={search}
      onSearchTermChange={(e) => setSearch(e.target.value)}
      onSearchClick={() => setPage(1)}
      actions={(item) => (
        <div className='gap-2 flex'>
          <Button
            variant='default'
            onClick={() =>
              router.push(`/vendor/service/${item.serviceId}/edit`)
            }
          >
            Edit
          </Button>
          <Button
            variant='destructive'
            onClick={() => console.log('Block service:', item.serviceId)}
          >
            Block
          </Button>
        </div>
      )}
      headerActions={
        <Button onClick={() => router.push('/vendor/service/add')}>
          Add New Service
        </Button>
      }
    />
  )
}
