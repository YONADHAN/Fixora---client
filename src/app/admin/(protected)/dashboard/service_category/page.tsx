'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  useGetAllServiceCategories,
  useBlockServiceCategory,
} from '@/lib/hooks/userServiceCategory'
import { useDebounce } from '@/lib/hooks/useDebounce'

import {
  ResponsiveTable,
  ColumnDefinition,
} from '@/components/shared-ui/resusable_components/table/TableWithPagination'

import { ConfirmDialog } from '@/components/shared-ui/resusable_components/DialogBox/confirmationPopup'
import { ServiceCategoryItem } from '@/types/service_category/service_category'

export default function ServiceCategoryListPage() {
  const router = useRouter()

  /* -------------------------------
      State & Data Fetching
  ---------------------------------*/
  const [page, setPage] = useState(1)
  const [limit] = useState(4)
  const [searchInput, setSearchInput] = useState('')

  const debouncedSearch = useDebounce(searchInput, 500)

  const { data, isLoading } = useGetAllServiceCategories(
    page,
    limit,
    debouncedSearch
  )

  const categories = data?.categories || []
  const totalPages = data?.totalPages || 1

  /* -------------------------------
      Confirm Dialog
  ---------------------------------*/
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    item: null as ServiceCategoryItem | null,
    action: '' as 'block' | 'unblock',
  })

  const blockMutation = useBlockServiceCategory()

  const handleOpenConfirm = (item: ServiceCategoryItem) => {
    setConfirmDialog({
      open: true,
      item,
      action: item.status === 'active' ? 'block' : 'unblock',
    })
  }

  const handleConfirm = () => {
    if (!confirmDialog.item) return

    blockMutation.mutate(
      {
        categoryId: confirmDialog.item.categoryId,
        status: confirmDialog.action === 'block' ? 'inactive' : 'active',
      },
      {
        onSuccess: () => {
          setConfirmDialog({ open: false, item: null, action: 'block' })
        },
      }
    )
  }

  const handleCancel = () => {
    setConfirmDialog({ open: false, item: null, action: 'block' })
  }

  /* -------------------------------
      Table Columns
  ---------------------------------*/
  const columns: ColumnDefinition<ServiceCategoryItem>[] = [
    { key: 'name', header: 'Category Name' },
    { key: 'description', header: 'Description' },
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

  /* -------------------------------
      Row Actions
  ---------------------------------*/
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
        onClick={() => handleOpenConfirm(item)}
      >
        {item.status === 'active' ? 'Block' : 'Unblock'}
      </Button>
    </div>
  )

  return (
    <main className='min-h-screen bg-background'>
      {/* Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <ResponsiveTable<ServiceCategoryItem>
          title='Categories'
          data={categories}
          loading={isLoading}
          columns={columns}
          actions={customActions}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          searchTerm={searchInput}
          onSearchTermChange={(e) => setSearchInput(e.target.value)}
          onSearchClick={() => setPage(1)}
          headerActions={
            <Button onClick={() => router.push('service_category/add')}>
              Add Category
            </Button>
          }
        />

        {/* Confirm Dialog */}
        <ConfirmDialog
          open={confirmDialog.open}
          title={
            confirmDialog.action === 'block'
              ? 'Block Category'
              : 'Unblock Category'
          }
          description={
            confirmDialog.item
              ? `Are you sure you want to ${confirmDialog.action} "${confirmDialog.item.name}"?`
              : ''
          }
          confirmLabel={confirmDialog.action === 'block' ? 'Block' : 'Unblock'}
          confirmColor={confirmDialog.action === 'block' ? 'red' : 'green'}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </div>
    </main>
  )
}
