'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  ResponsiveTable,
  ColumnDefinition,
} from '@/components/shared-ui/resusable_components/table/TableWithPagination'
import { useGetAllSubServiceCategories } from '@/lib/hooks/useSubServiceCategory'
import { SubServiceCategoryItem } from '@/dtos/sub_service_categories_dto'
import {
  useToggleBlockStatus,
  useToggleVerificationStatus,
} from '@/lib/hooks/useSubServiceCategory'
import { toast } from 'sonner'

type TableRow = SubServiceCategoryItem & { id: string }

export default function AdminSubServiceCategoryPage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(3)
  const [search, setSearch] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading } = useGetAllSubServiceCategories({
    page,
    limit,
    search,
  })

  const toggleBlockMutation = useToggleBlockStatus()
  const toggleVerifyMutation = useToggleVerificationStatus()

  const handleBlock = (item: TableRow) => {
    const newStatus = item.isActive === 'active' ? 'blocked' : 'active'

    toggleBlockMutation.mutate(
      {
        subServiceCategoryId: item.subServiceCategoryId,
        blockStatus: newStatus,
      },
      {
        onSuccess: () => {
          toast.success(`Status changed to ${newStatus}`)
        },
        onError: () => {
          toast.error('Failed to update status')
        },
      }
    )
  }

  const handleVerify = (item: TableRow) => {
    // Toggle verification state:
    let nextStatus: 'accepted' | 'pending' | 'rejected' = 'accepted'

    if (item.verification === 'accepted') nextStatus = 'rejected'
    else if (item.verification === 'rejected') nextStatus = 'accepted'
    else if (item.verification === 'pending') nextStatus = 'accepted'

    toggleVerifyMutation.mutate(
      {
        subServiceCategoryId: item.subServiceCategoryId,
        verificationStatus: nextStatus,
      },
      {
        onSuccess: () => {
          toast.success(`Verification changed to ${nextStatus}`)
        },
        onError: () => {
          toast.error('Failed to change verification')
        },
      }
    )
  }

  const tableData: TableRow[] =
    data?.data.map((item) => ({
      ...item,
      id: item.subServiceCategoryId,
    })) ?? []

  const columns: ColumnDefinition<TableRow>[] = [
    {
      key: 'name',
      header: 'Sub Service Name',
    },
    {
      key: 'serviceCategoryName',
      header: 'Parent Service',
    },
    {
      key: 'bannerImage',
      header: 'Image',
      render: (item) => (
        <Image
          src={item.bannerImage}
          alt='Sub Service'
          width={50}
          height={50}
          className='rounded-md border'
        />
      ),
    },
    {
      key: 'isActive',
      header: 'Active Status',
      render: (item) => (
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
      render: (item) => {
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
  ]

  /* ------------------------------------------
     Actions (Edit / Block / Verify)
  ------------------------------------------ */
  const renderActions = (item: TableRow) => {
    return (
      <>
        {/* Edit Button */}
        <Link
          href={`/admin/dashboard/sub-service-category/${item.subServiceCategoryId}/edit`}
        >
          <Button size='sm' variant='outline'>
            Edit
          </Button>
        </Link>

        {/* Block / Unblock */}
        <Button
          size='sm'
          variant={item.isActive === 'active' ? 'destructive' : 'outline'}
          onClick={() => handleBlock(item)}
        >
          {item.isActive === 'active' ? 'Block' : 'Unblock'}
        </Button>

        {/* Verification */}
        <Button
          size='sm'
          variant={item.verification === 'accepted' ? 'destructive' : 'outline'}
          onClick={() => handleVerify(item)}
        >
          {item.verification === 'accepted' ? 'Reject' : 'Verify'}
        </Button>
      </>
    )
  }

  return (
    <div className='p-6'>
      <ResponsiveTable<TableRow>
        title='Sub Service Categories'
        data={tableData}
        loading={isLoading}
        columns={columns}
        actions={renderActions}
        currentPage={data?.currentPage ?? 1}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        searchTerm={searchTerm}
        onSearchTermChange={(e) => {
          setSearchTerm(e.target.value)
          //setSearch(searchTerm)
        }}
        onSearchClick={() => setSearch(searchTerm)}
        headerActions={
          <Link href='/admin/dashboard/sub-service-category/add'>
            <Button>Create New Sub Service</Button>
          </Link>
        }
      />
    </div>
  )
}
