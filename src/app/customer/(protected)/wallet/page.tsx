'use client'

import React, { useState } from 'react'
import { useCustomerWallet } from '@/lib/hooks/useWallet'

export default function CustomerWalletPage() {
  const [sortBy, setSortBy] = useState('createdAt')
  const [order, setOrder] = useState('desc')
  const { data, isLoading, error } = useCustomerWallet(sortBy, order)

  if (isLoading)
    return (
      <div className='p-6 text-center text-gray-500 dark:text-gray-400'>Loading wallet...</div>
    )

  if (error)
    return (
      <div className='p-6 text-center text-gray-500 dark:text-red-400'>Something went wrong</div>
    )

  if (!data?.wallet)
    return <div className='p-6 text-center text-gray-500 dark:text-gray-400'>No wallet found</div>

  return (
    <div className='max-w-3xl mx-auto p-6 space-y-6'>
      {/* Balance */}
      <div className='border rounded-lg p-4 bg-white dark:bg-slate-900 dark:border-gray-800 shadow-sm'>
        <p className='text-sm text-gray-500 dark:text-gray-400'>Available Balance</p>
        <h1 className='text-3xl font-bold mt-1 text-slate-800 dark:text-white'>₹{data.wallet.balance}</h1>
        <p className='text-xs text-gray-500 dark:text-gray-500 mt-1 uppercase'>{data.wallet.currency}</p>
      </div>

      {/* Transactions */}
      <div className='border dark:border-gray-800 rounded-lg bg-white dark:bg-slate-900 shadow-sm overflow-hidden'>
        <div className='px-6 py-4 border-b dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-800/50'>
          <h2 className='text-base font-semibold text-gray-800 dark:text-white'>
            Transaction History
          </h2>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Sort by:</span>
            <select
              value={`${sortBy}-${order}`}
              onChange={(e) => {
                const [newSortBy, newOrder] = e.target.value.split('-')
                setSortBy(newSortBy)
                setOrder(newOrder)
              }}
              className="text-sm border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-slate-500 focus:ring-slate-500 bg-white dark:bg-slate-800 dark:text-gray-200 py-1 pl-2 pr-8"
            >
              <option value="createdAt-desc">Date (Newest First)</option>
              <option value="createdAt-asc">Date (Oldest First)</option>
              <option value="amount-desc">Amount (High to Low)</option>
              <option value="amount-asc">Amount (Low to High)</option>
              <option value="type-asc">Type (Credits First)</option>
              <option value="type-desc">Type (Debits First)</option>
            </select>
          </div>
        </div>

        {data.transactions.length === 0 ? (
          <p className='text-center text-gray-500 dark:text-gray-400 py-12'>No transactions yet</p>
        ) : (
          <ul className='divide-y divide-gray-100 dark:divide-gray-800'>
            {data.transactions.map((tx) => (
              <li
                key={tx.transactionId}
                className='flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors'
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className='text-sm font-medium text-gray-900 dark:text-gray-200'>
                      {tx.description ?? 'Wallet transaction'}
                    </p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tx.type === 'credit'
                      ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                      : 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                      }`}>
                      {tx.type.toUpperCase()}
                    </span>
                  </div>
                  <p className='text-xs text-gray-500 dark:text-gray-500 mt-0.5'>
                    {new Date(tx.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className={`text-sm font-semibold ${tx.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                  {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
