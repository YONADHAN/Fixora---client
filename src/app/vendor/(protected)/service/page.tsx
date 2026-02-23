'use client'

import { useState } from 'react'
import {
  ColumnDefinition,
  ResponsiveTable,
} from '@/components/shared-ui/resusable_components/table/TableWithPagination'
import { useGetAllServices, useToggleServiceById } from '@/lib/hooks/useService'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface ServiceRow {
  id: string
  serviceId: string
  name: string
  description: string
  mainImage: string
  isActiveStatusByVendor: boolean
}

export default function AdminServicesPage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(3)
  const [search, setSearch] = useState('')
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data, isLoading } = useGetAllServices({
    page: String(page),
    limit: String(limit),
    search,
  })

  const toggleMutation = useToggleServiceById()

  const tableData: ServiceRow[] = (data?.data || []).map((item) => ({
    id: item.serviceId,
    serviceId: item.serviceId,
    name: item.name,
    description: item.description,
    mainImage: item.mainImage,
    isActiveStatusByVendor: item.isActiveStatusByVendor,
  }))

  const handleBlock = (serviceId: string) => {
    toggleMutation.mutate(
      { serviceId },
      {
        onSuccess: (res) => {
          const statusText = res.isActiveStatusByVendor
            ? 'unblocked'
            : 'blocked'

          toast.success(`Service ${statusText} successfully`)

          queryClient.invalidateQueries({ queryKey: ['getAllServices'] })
        },
        onError: () => {
          toast.error('Failed to toggle service status')
        },
      }
    )
  }

  /* ✅ UPDATED COLUMNS */
  const columns: ColumnDefinition<ServiceRow>[] = [
    {
      key: 'name',
      header: 'Title',
    },
    {
      key: 'mainImage',
      header: 'Image',
      render: (item) => (
        <img
          src={item.mainImage || '/placeholder.jpg'}
          alt={item.name}
          className='w-14 h-14 rounded-md object-cover'
        />
      ),
    },
    {
      key: 'isActiveStatusByVendor',
      header: 'Status',
      render: (item) => (
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
  ]

  return (
    <ResponsiveTable<ServiceRow>
      title='All Services'
      data={tableData}
      loading={isLoading || toggleMutation.isPending}
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
            variant={item.isActiveStatusByVendor ? 'destructive' : 'outline'}
            onClick={() => handleBlock(item.serviceId)}
            disabled={toggleMutation.isPending}
          >
            {item.isActiveStatusByVendor ? 'Block' : 'Unblock'}
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
