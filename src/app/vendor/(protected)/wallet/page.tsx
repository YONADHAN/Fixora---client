'use client'

import React, { useState } from 'react'
import { useVendorWallet } from '@/lib/hooks/useWallet'
import { Pagination } from '@/components/shared-ui/resusable_components/pagination/pagination'

export default function VendorWalletPage() {
  const [sortBy, setSortBy] = useState('createdAt')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useVendorWallet({
    page,
    limit: 4,
    sortBy,
    order,
  })

  if (isLoading)
    return (
      <div className='p-6 text-center text-gray-500 dark:text-gray-400'>
        Loading wallet...
      </div>
    )

  if (error)
    return (
      <div className='p-6 text-center text-red-500'>Something went wrong</div>
    )

  if (!data?.wallet)
    return <div className='p-6 text-center text-gray-500'>No wallet found</div>

  return (
    <div className='max-w-3xl mx-auto p-6 space-y-6'>
      {/* Balance */}
      <div className='border rounded-lg p-4 bg-white dark:bg-slate-900 dark:border-gray-800 shadow-sm'>
        <p className='text-sm text-gray-500'>Available Balance</p>
        <h1 className='text-3xl font-bold mt-1'>₹{data.wallet.balance}</h1>
        <p className='text-xs text-gray-500 mt-1 uppercase'>
          {data.wallet.currency}
        </p>
      </div>

      {/* Transactions */}
      <div className='border rounded-lg bg-white dark:bg-slate-900 shadow-sm overflow-hidden'>
        <div className='px-6 py-4 border-b flex justify-between items-center'>
          <h2 className='font-semibold'>Transaction History</h2>

          <select
            value={`${sortBy}-${order}`}
            onChange={(e) => {
              const [newSortBy, newOrder] = e.target.value.split('-')
              setSortBy(newSortBy)
              setOrder(newOrder as 'asc' | 'desc')
              setPage(1)
            }}
            className='border rounded px-2 py-1'
          >
            <option value='createdAt-desc'>Newest</option>
            <option value='createdAt-asc'>Oldest</option>
            <option value='amount-desc'>Amount ↓</option>
            <option value='amount-asc'>Amount ↑</option>
          </select>
        </div>

        {data.data.length === 0 ? (
          <p className='text-center py-12 text-gray-500'>No transactions yet</p>
        ) : (
          <>
            <ul className='divide-y'>
              {data.data.map((tx) => (
                <li
                  key={tx.transactionId}
                  className='flex justify-between px-6 py-4'
                >
                  <div>
                    <p className='font-medium'>
                      {tx.description ?? 'Wallet transaction'}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div
                    className={`font-semibold ${
                      tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                  </div>
                </li>
              ))}
            </ul>

            <Pagination
              currentPage={data.currentPage}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  )
}
