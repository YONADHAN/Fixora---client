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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
type SortField = 'name' | 'email' | 'createdAt';
type Status = 'all' | 'pending' | 'active' | 'blocked'
type SortOption = 'latest' | 'oldest' | 'name_asc' | 'name_desc' | 'email_asc' | 'email_desc';
type FilterOption = 'all' | 'active' | 'blocked';

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

  const [sort, setSort] = useState<SortOption>('latest');
  const [filter, setFilter] = useState<FilterOption>('all');

  let sortField = 'createdAt';
  let sortOrder = 'desc';

  if (sort === 'oldest') {
    sortOrder = 'asc';
  } else if (sort === 'name_asc') {
    sortField = 'name';
    sortOrder = 'asc';
  } else if (sort === 'name_desc') {
    sortField = 'name';
    sortOrder = 'desc';
  } else if (sort === 'email_asc') {
    sortField = 'email';
    sortOrder = 'asc';
  } else if (sort === 'email_desc') {
    sortField = 'email';
    sortOrder = 'desc';
  }

  // ----------------------- React Query: Fetch Vendors -----------------------
  const { data, isLoading, refetch } = useGetAllVendors({
    page: currentPage,
    limit,
    search: appliedSearch,
    sortField,
    sortOrder,
    status: filter,
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

        headerActions={
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                <SelectItem value="email_asc">Email (A-Z)</SelectItem>
                <SelectItem value="email_desc">Email (Z-A)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filter} onValueChange={(value) => setFilter(value as FilterOption)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active Users</SelectItem>
                <SelectItem value="blocked">Blocked Users</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
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
