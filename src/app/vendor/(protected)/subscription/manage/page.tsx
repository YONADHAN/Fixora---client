'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  ColumnDefinition,
  ResponsiveTable,
} from '@/components/shared-ui/resusable_components/table/TableWithPagination'
import {
  useGetMySubscriptions,
  useCancelSubscription,
} from '@/lib/hooks/useSubscription'
import { VendorSubscriptionItem, SubscriptionStatus } from '@/dtos/subscription_dto'


interface SubscriptionTableRow {
  id: string
  subscriptionId: string
  planName: string
  price: string
  duration: string
  startDate: string
  endDate: string
  status: SubscriptionStatus
  paymentStatus: string
  autoRenew: string
}


function formatDate(dateStr?: string): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function statusBadge(status: SubscriptionStatus) {
  const variants: Record<SubscriptionStatus, string> = {
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
    expired: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${variants[status] ?? ''}`}
    >
      {status}
    </span>
  )
}


export default function SubscriptionManagePage() {
  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [page, setPage] = useState(1)

  // Confirmation dialog state
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { data, isLoading } = useGetMySubscriptions()
  const { mutate: cancelSubscription, isPending: isCancelling } =
    useCancelSubscription()


  const allSubscriptions: VendorSubscriptionItem[] =
    data?.data?.subscriptions ?? []

  const filtered = appliedSearch
    ? allSubscriptions.filter(
      (s) =>
        s.plan.name.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        s.status.toLowerCase().includes(appliedSearch.toLowerCase()),
    )
    : allSubscriptions


  const PAGE_SIZE = 5
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const tableData: SubscriptionTableRow[] = paged.map((s) => ({
    id: s.subscriptionId,
    subscriptionId: s.subscriptionId,
    planName: s.plan.name,
    price: `₹${s.plan.price}`,
    duration: `${s.plan.durationInDays} days`,
    startDate: formatDate(s.startDate),
    endDate: formatDate(s.endDate),
    status: s.status,
    paymentStatus: s.paymentStatus,
    autoRenew: s.autoRenew ? 'Yes' : 'No',
  }))


  const columns: ColumnDefinition<SubscriptionTableRow>[] = [
    {
      key: 'planName',
      header: 'Plan',
      render: (item) => (
        <span className="font-medium">{item.planName}</span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (item) => (
        <span className="font-semibold text-primary">{item.price}</span>
      ),
    },
    {
      key: 'duration',
      header: 'Duration',
    },
    {
      key: 'startDate',
      header: 'Start Date',
    },
    {
      key: 'endDate',
      header: 'End Date',
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => statusBadge(item.status),
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      render: (item) => (
        <Badge variant="outline" className="capitalize">
          {item.paymentStatus}
        </Badge>
      ),
    },
    {
      key: 'autoRenew',
      header: 'Auto-Renew',
      render: (item) => (
        <span
          className={
            item.autoRenew === 'Yes'
              ? 'text-emerald-600 font-medium'
              : 'text-muted-foreground'
          }
        >
          {item.autoRenew}
        </span>
      ),
    },
  ]


  const handleCancelClick = (subscriptionId: string) => {
    setSelectedId(subscriptionId)
    setConfirmOpen(true)
  }

  const handleConfirmCancel = () => {
    if (!selectedId) return
    cancelSubscription(selectedId, {
      onSettled: () => {
        setConfirmOpen(false)
        setSelectedId(null)
      },
    })
  }


  return (
    <>
      <ResponsiveTable<SubscriptionTableRow>
        title="My Subscriptions"
        data={tableData}
        loading={isLoading}
        columns={columns}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
        searchTerm={search}
        onSearchTermChange={(e) => setSearch(e.target.value)}
        onSearchClick={() => {
          setAppliedSearch(search)
          setPage(1)
        }}
        searchPlaceholder="Search by plan name or status…"
        actions={(item) =>
          item.status === 'active' ? (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleCancelClick(item.subscriptionId)}
            >
              Cancel
            </Button>
          ) : null
        }
      />

      {/* ── Confirmation Dialog ─────────────────────────────────────── */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this subscription? This action
              cannot be undone and your plan benefits will be revoked immediately
              via Stripe.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={isCancelling}
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={isCancelling}
            >
              {isCancelling ? 'Cancelling…' : 'Yes, Cancel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}