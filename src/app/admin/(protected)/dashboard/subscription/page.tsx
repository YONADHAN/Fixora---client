'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, CheckCircle, XCircle } from 'lucide-react'
import {
  useAdminSubscriptionPlans,
  useToggleSubscriptionPlan,
} from '@/lib/hooks/useSubscription'
import {
  ResponsiveTable,
  ColumnDefinition,
  TableItem,
} from '@/components/shared-ui/resusable_components/table/TableWithPagination'
import { SubscriptionPlan } from '@/types/subscription/subscription.type'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

type SubscriptionPlanTableItem = SubscriptionPlan & TableItem

export default function SubscriptionListPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const limit = 10

  const { data, isLoading } = useAdminSubscriptionPlans(
    page,
    limit,
    debouncedSearch,
  )
  console.log('Data : ', data)
  const { mutate: togglePlan } = useToggleSubscriptionPlan()

  const handleSearchClick = () => {
    setDebouncedSearch(searchTerm)
    setPage(1)
  }

  const handleToggle = (planId: string) => {
    togglePlan(planId, {
      onSuccess: () => {
        toast.success('Subscription plan status updated')
      },
      onError: () => {
        toast.error('Failed to update status')
      },
    })
  }

  const columns: ColumnDefinition<SubscriptionPlanTableItem>[] = [
    {
      key: 'name',
      header: 'Plan Name',
    },
    {
      key: 'price',
      header: 'Price',
      render: (item) => (
        <span>
          {item.currency.toUpperCase()} {item.price}
        </span>
      ),
    },
    {
      key: 'durationInDays',
      header: 'Duration',
      render: (item) => (
        <span>
          {item.durationInDays} days (
          {item.durationInDays === 30
            ? 'Monthly'
            : item.durationInDays === 365
              ? 'Yearly'
              : 'Custom'}
          )
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (item) => (
        <Badge variant={item.isActive ? 'default' : 'destructive'}>
          {item.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ]

  const actions = (item: SubscriptionPlanTableItem) => (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        size='sm'
        onClick={() =>
          router.push(`/admin/dashboard/subscription/${item.planId}/edit`)
        }
      >
        <Edit className='w-4 h-4' />
      </Button>
      <Button
        variant={item.isActive ? 'destructive' : 'default'}
        size='sm'
        onClick={() => handleToggle(item.planId)}
        title={item.isActive ? 'Deactivate' : 'Activate'}
      >
        {item.isActive ? (
          <XCircle className='w-4 h-4' />
        ) : (
          <CheckCircle className='w-4 h-4' />
        )}
      </Button>
    </div>
  )

  return (
    <div className='p-6'>
      <ResponsiveTable
        title='Subscription Plans'
        data={
          data?.data.data.map((plan: SubscriptionPlan) => ({
            ...plan,
            id: plan.planId,
          })) || []
        }
        loading={isLoading}
        columns={columns}
        actions={actions}
        currentPage={page}
        totalPages={data?.totalPages || 1}
        onPageChange={setPage}
        searchTerm={searchTerm}
        onSearchTermChange={(e) => setSearchTerm(e.target.value)}
        onSearchClick={handleSearchClick}
        searchPlaceholder='Search plans...'
        headerActions={
          <Button
            onClick={() => router.push('/admin/dashboard/subscription/add')}
          >
            <Plus className='w-4 h-4 mr-2' />
            Add Plan
          </Button>
        }
      />
    </div>
  )
}
