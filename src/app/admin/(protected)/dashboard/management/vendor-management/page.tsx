'use client'

import React, { useState } from 'react'
import { ResponsiveTable } from '@/components/shared-ui/resusable_components/table/TableWithPagination'
import {
  useGetAllVendors,
  useChangeMyUserBlockStatus,
} from '@/lib/hooks/useAdmin'
import { ConfirmDialog } from '@/components/shared-ui/resusable_components/DialogBox/confirmationPopup'
import { Button } from '@/components/ui/button'

type StatusType = 'active' | 'blocked'

interface Vendor {
  id: string
  userId: string
  name: string
  email: string
  role: string
  status: StatusType
  createdAt: string
  updatedAt: string
}

const VendorPage = () => {
  // ------- Pagination & Search -------
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const limit = 4

  // ----------------------- React Query: Fetch Vendors -----------------------
  const { data, isLoading, refetch } = useGetAllVendors({
    page: currentPage,
    limit,
    search: appliedSearch,
  })

  // Map users to include 'id' required by TableItem
  const vendors: Vendor[] = (data?.data?.data?.data || []).map(
    (user: Omit<Vendor, 'id'>) => ({
      ...user,
      id: user.userId,
    })
  )
  const totalPages = data?.data?.data?.totalPages || 1

  // ----------------------- Dialog State -----------------------
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    item: null as Vendor | null,
    newStatus: 'blocked' as StatusType,
  })

  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())

  // ----------------------- React Query: Block/Unblock Mutation -----------------------
  const { mutateAsync: changeBlockStatus } = useChangeMyUserBlockStatus({
    role: 'vendor',
    userId: confirmDialog.item?.userId || '',
    status: confirmDialog.newStatus,
  })

  // ----------------------- Handlers -----------------------
  const handleBlockUnblockClick = (item: Vendor) => {
    const newStatus: StatusType =
      item.status === 'active' ? 'blocked' : 'active'
    setConfirmDialog({ isOpen: true, item, newStatus })
  }

  const handleCancelAction = () => {
    setConfirmDialog({ isOpen: false, item: null, newStatus: 'blocked' })
  }

  const updateVendorStatus = async (id: string, newStatus: StatusType) => {
    try {
      setUpdatingItems((prev) => new Set(prev).add(id))
      await changeBlockStatus()
      await refetch()
    } catch (error) {
      console.error(`Error updating vendor status to ${newStatus}:`, error)
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const handleConfirmAction = async () => {
    const { item, newStatus } = confirmDialog
    if (!item) return

    await updateVendorStatus(item.userId, newStatus)
    setConfirmDialog({ isOpen: false, item: null, newStatus: 'blocked' })
  }

  // ----------------------- Search Handlers -----------------------
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchClick = () => {
    setCurrentPage(1)
    setAppliedSearch(searchTerm)
  }

  // ----------------------- Table Columns -----------------------
  const columns = [

    { key: 'name' as keyof Vendor, header: 'Name' },
    { key: 'email' as keyof Vendor, header: 'Email' },
    {
      key: 'status' as keyof Vendor,
      header: 'Status',
      render: (item: Vendor) => (
        <span
          className={`${item.status === 'active' ? 'text-green-600' : 'text-red-500'
            } font-medium`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: 'createdAt' as keyof Vendor,
      header: 'Created At',
      render: (item: Vendor) => {
        const date = new Date(item.createdAt)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}.${month}.${year}`
      },
    },
  ]

  // ----------------------- Render -----------------------
  return (
    <div className='p-6'>
      <ResponsiveTable<Vendor>
        title='Vendor Management'
        data={vendors}
        loading={isLoading}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        searchTerm={searchTerm}
        onSearchTermChange={handleSearchTermChange}
        onSearchClick={handleSearchClick}
        searchPlaceholder='Search by name or email...'
        actions={(item) => (
          <Button
            variant='destructive'
            size='sm'
            onClick={() => handleBlockUnblockClick(item)}
            disabled={updatingItems.has(item.userId)}
          >
            {updatingItems.has(item.userId)
              ? 'Updating...'
              : item.status === 'active'
                ? 'Block'
                : 'Unblock'}
          </Button>
        )}
      />

      <ConfirmDialog
        open={confirmDialog.isOpen}
        onCancel={handleCancelAction}
        onConfirm={handleConfirmAction}
        title={
          confirmDialog.newStatus === 'blocked'
            ? 'Block Vendor'
            : 'Unblock Vendor'
        }
        description={`Are you sure you want to ${confirmDialog.newStatus === 'blocked' ? 'block' : 'unblock'
          } vendor "${confirmDialog.item?.name}"?`}
        confirmLabel={
          confirmDialog.newStatus === 'blocked' ? 'Block' : 'Unblock'
        }
        confirmColor={confirmDialog.newStatus === 'blocked' ? 'red' : 'green'}
      />
    </div>
  )
}

export default VendorPage
