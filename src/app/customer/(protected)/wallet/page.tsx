'use client'

import { useCustomerWallet } from '@/lib/hooks/useWallet'

export default function CustomerWalletPage() {
  const { data, isLoading, error } = useCustomerWallet()

  if (isLoading)
    return (
      <div className='p-6 text-center text-gray-500'>Loading wallet...</div>
    )

  if (error)
    return (
      <div className='p-6 text-center text-gray-500'>Something went wrong</div>
    )

  if (!data?.wallet)
    return <div className='p-6 text-center text-gray-500'>No wallet found</div>

  return (
    <div className='max-w-3xl mx-auto p-6 space-y-6'>
      {/* Balance */}
      <div className='border rounded-lg p-4'>
        <p className='text-sm text-gray-500'>Available Balance</p>
        <h1 className='text-2xl font-semibold mt-1'>₹{data.wallet.balance}</h1>
        <p className='text-xs text-gray-500 mt-1'>{data.wallet.currency}</p>
      </div>

      {/* Transactions */}
      <div className='border rounded-lg'>
        <div className='px-4 py-3 border-b'>
          <h2 className='text-sm font-medium text-gray-700'>
            Transaction History
          </h2>
        </div>

        {data.transactions.length === 0 ? (
          <p className='text-center text-gray-500 py-6'>No transactions yet</p>
        ) : (
          <ul className='divide-y'>
            {data.transactions.map((tx) => (
              <li
                key={tx.transactionId}
                className='flex items-center justify-between px-4 py-3'
              >
                <div>
                  <p className='text-sm text-gray-800'>
                    {tx.description ?? 'Wallet transaction'}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {new Date(tx.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className='text-sm font-medium text-gray-800'>
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
