'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGetAllServiceCategories } from '@/lib/hooks/userServiceCategory'
import { useBlockServiceCategory } from '@/lib/hooks/userServiceCategory'
import {
  ResponsiveTable,
  ColumnDefinition,
} from '@/components/shared-ui/resusable_components/table/table'
import { Button } from '@/components/ui/button'
import { ServiceCategoryItem } from '@/types/service_category/service_category'
import { useDebounce } from '@/lib/hooks/useDebounce'
export default function ServiceCategoryListPage() {
  const router = useRouter()

  // State
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState('')

  //debouncing logic
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 500)
  const { data, isLoading } = useGetAllServiceCategories(
    page,
    limit,
    debouncedSearch
  )

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    item: null as ServiceCategoryItem | null,
    action: 'block' as 'block' | 'unblock',
  })

  const updatingItems = new Set<string>()

  const blockMutation = useBlockServiceCategory()
  console.log('Response data from page is ', data)
  const categories = data?.categories || []
  const totalPages = data?.totalPages || 1

  const handleBlockUnblockClick = (item: ServiceCategoryItem) => {
    setConfirmDialog({
      isOpen: true,
      item,
      action: item.status === 'active' ? 'block' : 'unblock',
    })
  }

  const handleConfirmAction = () => {
    if (!confirmDialog.item) return

    blockMutation.mutate(
      {
        categoryId: confirmDialog.item.userId,
        status: confirmDialog.action === 'block' ? 'inactive' : 'active',
      },
      {
        onSuccess: () => {
          setConfirmDialog({ isOpen: false, item: null, action: 'block' })
        },
      }
    )
  }

  const handleCancelAction = () => {
    setConfirmDialog({ isOpen: false, item: null, action: 'block' })
  }

  const columns: ColumnDefinition<ServiceCategoryItem>[] = [
    {
      key: 'name',
      header: 'Category Name',
    },
    {
      key: 'description',
      header: 'Description',
    },
    {
      key: 'bannerUrl',
      header: 'Banner',
      render: (item) => (
        <img
          src={item.bannerUrl || '/placeholder.svg'}
          alt={item.name}
          className='w-16 h-12 object-cover rounded'
        />
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <span
          className={
            item.status === 'active'
              ? 'text-green-600 font-semibold'
              : 'text-red-600 font-semibold'
          }
        >
          {item.status}
        </span>
      ),
    },
  ]

  const customActions = (item: ServiceCategoryItem) => (
    <div className='flex gap-2 justify-center'>
      <Button
        size='sm'
        variant='secondary'
        onClick={() =>
          router.push(`/admin/dashboard/service_category/${item.userId}/edit`)
        }
      >
        Edit
      </Button>

      <Button
        size='sm'
        variant={item.status === 'active' ? 'destructive' : 'default'}
        onClick={() => handleBlockUnblockClick(item)}
      >
        {item.status === 'active' ? 'Block' : 'Unblock'}
      </Button>
    </div>
  )

  return (
    <main className='min-h-screen bg-background'>
      <div className='border-b border-border bg-card'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div>
              <h1 className='text-3xl font-bold text-foreground'>
                Service Categories
              </h1>
              <p className='text-sm text-muted-foreground mt-1'>
                Manage and organize your service categories
              </p>
            </div>
            <Button
              onClick={() => router.push('service_category/add')}
              className='w-full sm:w-auto'
            >
              Add Category
            </Button>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <ResponsiveTable<ServiceCategoryItem>
          data={categories}
          loading={isLoading}
          updatingItems={updatingItems}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          searchTerm={searchInput}
          onSearchTermChange={(e) => setSearchInput(e.target.value)}
          onSearchKeyPress={(e) => {
            if (e.key === 'Enter') setSearch(searchInput)
          }}
          onSearchClick={() => setSearch(searchInput)}
          onBlockUnblockClick={handleBlockUnblockClick}
          confirmDialog={confirmDialog}
          onConfirmAction={handleConfirmAction}
          onCancelAction={handleCancelAction}
          entityType='service category'
          columns={columns}
          customActions={customActions}
          showActionsColumn={true}
        />
      </div>
    </main>
  )
}
