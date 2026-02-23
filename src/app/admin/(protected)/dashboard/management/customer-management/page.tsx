'use client'

import React, { useState } from 'react'
import { ResponsiveTable } from '@/components/shared-ui/resusable_components/table/TableWithPagination'
import {
  useGetAllCustomers,
  useChangeMyUserBlockStatus,
} from '@/lib/hooks/useAdmin'
import { ConfirmDialog } from '@/components/shared-ui/resusable_components/DialogBox/confirmationPopup'
import { Button } from '@/components/ui/button'

type StatusType = 'active' | 'blocked'

interface Customer {
  id: string
  userId: string
  name: string
  email: string
  role: string
  status: StatusType
  createdAt: string
  updatedAt: string
}

const CustomerPage = () => {
  // ------- Pagination & Search -------
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const limit = 4

  // ----------------------- React Query: Fetch Customers -----------------------
  const { data, isLoading, refetch } = useGetAllCustomers({
    page: currentPage,
    limit,
    search: appliedSearch,
    role: 'customer',
  })

  // Map users to include 'id' required by TableItem
  const customers: Customer[] = (data?.data?.data?.data || []).map(
    (user: Omit<Customer, 'id'>) => ({
      ...user,
      id: user.userId,
    })
  )
  const totalPages = data?.data?.data?.totalPages || 1

  // ----------------------- Dialog State -----------------------
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    item: null as Customer | null,
    newStatus: 'blocked' as StatusType,
  })

  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())

  // ----------------------- React Query: Block/Unblock Mutation -----------------------
  const { mutateAsync: changeBlockStatus } = useChangeMyUserBlockStatus({
    role: 'customer',
    userId: confirmDialog.item?.userId || '',
    status: confirmDialog.newStatus,
  })

  // ----------------------- Handlers -----------------------
  const handleBlockUnblockClick = (item: Customer) => {
    const newStatus: StatusType =
      item.status === 'active' ? 'blocked' : 'active'
    setConfirmDialog({ isOpen: true, item, newStatus })
  }

  const handleCancelAction = () => {
    setConfirmDialog({ isOpen: false, item: null, newStatus: 'blocked' })
  }

  const updateCustomerStatus = async (id: string, newStatus: StatusType) => {
    try {
      setUpdatingItems((prev) => new Set(prev).add(id))
      await changeBlockStatus()
      await refetch()
    } catch (error) {
      console.error(`Error updating customer status to ${newStatus}:`, error)
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

    await updateCustomerStatus(item.userId, newStatus)
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

    { key: 'name' as keyof Customer, header: 'Name' },
    { key: 'email' as keyof Customer, header: 'Email' },
    {
      key: 'status' as keyof Customer,
      header: 'Status',
      render: (item: Customer) => (
        <span
          className={`${item.status === 'active' ? 'text-green-600' : 'text-red-500'
            } font-medium`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: 'createdAt' as keyof Customer,
      header: 'Created At',
      render: (item: Customer) => {
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
      <ResponsiveTable<Customer>
        title='Customer Management'
        data={customers}
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
            ? 'Block Customer'
            : 'Unblock Customer'
        }
        description={`Are you sure you want to ${confirmDialog.newStatus === 'blocked' ? 'block' : 'unblock'
          } customer "${confirmDialog.item?.name}"?`}
        confirmLabel={
          confirmDialog.newStatus === 'blocked' ? 'Block' : 'Unblock'
        }
        confirmColor={confirmDialog.newStatus === 'blocked' ? 'red' : 'green'}
      />
    </div>
  )
}

export default CustomerPage
