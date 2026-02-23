'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    ColumnDefinition,
    ResponsiveTable,
} from '@/components/shared-ui/resusable_components/table/TableWithPagination'
import { PaymentItemDTO } from '@/dtos/payment_dto'
import { usePaymentHistory } from '@/lib/hooks/usePayment'


interface PaymentTableItem {
    id: string
    paymentId: string
    bookingGroupId: string
    amount: number
    status: string
    date: Date
    serviceName?: string
    vendorName?: string
}

const formatDate = (date: Date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

export default function PaymentListPage() {
    const router = useRouter()
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')

    const { data, isLoading } = usePaymentHistory(page, 10, search)

    const tableData: PaymentTableItem[] =
        data?.data.map((payment: PaymentItemDTO) => ({
            id: payment.paymentId,
            paymentId: payment.paymentId,
            bookingGroupId: payment.bookingGroupId,
            amount: payment.amount,
            status: payment.status,
            date: payment.date,
            serviceName: payment.serviceName,
            vendorName: payment.vendorName,
        })) ?? []

    const columns: ColumnDefinition<PaymentTableItem>[] = [
        {
            key: 'date',
            header: 'Date',
            render: (item) => <span>{formatDate(item.date)}</span>,
        },
        {
            key: 'serviceName',
            header: 'Service',
            render: (item) => (
                <span className='font-medium'>{item.serviceName || 'N/A'}</span>
            ),
        },
        {
            key: 'bookingGroupId',
            header: 'Booking Group',
            render: (item) => <span className='text-xs font-mono'>{item.bookingGroupId || item.paymentId}</span>,
        },
        {
            key: 'amount',
            header: 'Amount',
            render: (item) => <span className='font-semibold'>₹{item.amount.toLocaleString('en-IN')}</span>
        },
        {
            key: 'status',
            header: 'Status',
            render: (item) => (
                <span className={`capitalize text-xs px-2 py-1 rounded-full ${item.status === 'fully-paid' ? 'bg-green-100 text-green-800' :
                    item.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-slate-100 dark:bg-slate-800'
                    }`}>
                    {item.status}
                </span>
            ),
        },
    ]

    return (
        <ResponsiveTable<PaymentTableItem>
            title='Payment History'
            data={tableData}
            loading={isLoading}
            columns={columns}
            currentPage={data?.currentPage ?? 1}
            totalPages={data?.totalPages ?? 1}
            onPageChange={(p) => setPage(p)}
            searchTerm={search}
            onSearchTermChange={(e) => setSearch(e.target.value)}
            onSearchClick={() => setPage(1)}
            searchPlaceholder='Search by ID, Status, Service...'
        />
    )
}
