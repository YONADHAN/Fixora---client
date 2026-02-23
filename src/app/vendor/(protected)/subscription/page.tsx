'use client'

import {
  useActiveSubscriptionPlans,
  useCreateSubscriptionCheckout,
} from '@/lib/hooks/useSubscription'
import { Button } from '@/components/ui/button'
import { ActiveSubscriptionPlans } from '@/types/subscription/subscription.type'
import { Check } from 'lucide-react'

export default function VendorSubscriptionPage() {
  const { data, isLoading } = useActiveSubscriptionPlans()
  const checkoutMutation = useCreateSubscriptionCheckout()

  if (isLoading) {
    return <div>Loading plans...</div>
  }

  const plans = data?.data.data || []

  return (
    <div className='space-y-8 px-5'>
      <div>
        <h1 className='text-3xl font-bold text-center'>Choose Your Plan</h1>
        <p className='text-center text-muted-foreground mt-2'>
          Select the perfect plan for your needs
        </p>
      </div>

      <div className='grid md:grid-cols-3 gap-8 max-w-7xl mx-auto'>
        {plans.map((plan: ActiveSubscriptionPlans) => (
          <div key={plan.planId} className='flex flex-col'>
            {/* Card Container */}
            <div className='bg-white dark:bg-slate-900 rounded-3xl shadow-lg overflow-hidden flex flex-col h-full transition-transform hover:shadow-xl hover:scale-105'>
              {/* Header Section */}
              <div className='relative pt-8 pb-12 px-6 bg-gradient-to-b from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700'>
                <div className='text-center mb-6'>
                  <h2 className='text-xl font-bold text-white tracking-wide'>
                    {plan.name}
                  </h2>

                  {/*  Description added */}
                  {plan.description && (
                    <p className='text-sm text-slate-300 mt-2 text-justify'>
                      {plan.description}
                    </p>
                  )}

                  <p className='text-xs text-slate-300 mt-2 font-semibold mb-10'>
                    {plan.interval === 'month' ? 'PER MONTH' : 'PER YEAR'}
                  </p>
                </div>

                <svg
                  className='absolute bottom-0 left-0 w-full '
                  viewBox='0 0 1440 120'
                  preserveAspectRatio='none'
                  height='80'
                >
                  <path
                    d='M0,40 Q360,0 720,40 T1440,40 L1440,120 L0,120 Z'
                    fill='currentColor'
                    className='text-slate-400 dark:text-slate-800'
                  />
                </svg>

                <div className='absolute left-1/2 transform -translate-x-1/2 -bottom-12'>
                  <div className='w-32 h-32 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center shadow-xl'>
                    <div className='text-white font-bold text-3xl'>
                      ₹{plan.price}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className='pt-20 px-6 pb-6 flex-1 flex flex-col'>
                <ul className='space-y-4 flex-1'>
                  {plan.benefits.map((benefit: string, idx: number) => (
                    <li key={idx} className='flex items-start gap-3'>
                      <Check
                        className='w-5 h-5 text-slate-600 dark:text-slate-400 mt-0.5'
                        strokeWidth={3}
                      />
                      <span className='text-sm text-slate-700 dark:text-slate-200'>
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant='outline'
                  className='w-full mt-6 rounded-full border-2 text-base font-semibold h-11 hover:bg-slate-100 dark:hover:bg-slate-800 dark:border-slate-600'
                  disabled={checkoutMutation.isPending}
                  onClick={async () => {
                    const res = await checkoutMutation.mutateAsync(plan.planId)
                    window.location.href = res.data.data.url
                  }}
                >
                  ORDER NOW →
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
