'use client'

import React, { useState } from 'react'
import { Search, CheckCircle, Clock, Shield, Star } from 'lucide-react'
import Image from 'next/image'
import { useGetActiveServiceCategories } from '@/lib/hooks/userServiceCategory'
import { useRouter } from 'next/navigation'
// import { testingOnlyApi } from '@/services/notification/notification.service'
// import { toast } from 'sonner'
interface TypeCategoryItem {
  serviceCategoryId: string
  name: string
  description: string
  bannerImage: string
}
export default function Page() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading } = useGetActiveServiceCategories()

  const activeCategories = data?.data?.data?.data || []

  const features = [
    {
      icon: CheckCircle,
      title: 'Verified Professionals',
      desc: 'All service providers are background checked',
    },
    {
      icon: Clock,
      title: 'Quick Booking',
      desc: 'Get service within 2 hours or schedule for later',
    },
    {
      icon: Shield,
      title: 'Service Guarantee',
      desc: '100% satisfaction or money back guarantee',
    },
    {
      icon: Star,
      title: 'Top Rated',
      desc: 'Only the best professionals with 4.5+ ratings',
    },
  ]

  // function createNotificationFunction() {
  //   testingOnlyApi()
  //   toast.success('notification send successfully: testing done')
  // }

  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-background dark:to-background'>
      {/* HERO SECTION */}
      <section className='relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden'>
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse'></div>
          <div
            className='absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl animate-pulse'
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        <div className='relative z-10 max-w-5xl mx-auto text-center space-y-8'>
          <div className='inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full text-sm text-blue-700 dark:text-blue-400 font-medium'>
            <span className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></span>
            Trusted by 50,000+ happy customers
          </div>

          <h1 className='text-5xl md:text-7xl font-bold text-gray-900 dark:text-foreground leading-tight'>
            Your Home Services,
            <span className='block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-2'>
              Just a Click Away
            </span>
          </h1>

          <p className='text-xl md:text-2xl text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
            Connect with verified local professionals for all your home service
            needs. Fast, reliable, and affordable.
          </p>

          {/* SEARCH BAR */}
          <div className='max-w-2xl mx-auto mt-12'>
            <div className='relative group'>
              <div className='absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300'></div>
              <div className='relative flex items-center bg-white dark:bg-card rounded-2xl shadow-2xl p-2'>
                <Search className='text-gray-400 dark:text-muted-foreground ml-4' size={24} />
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='What service do you need today?'
                  className='flex-1 px-4 py-4 text-lg outline-none text-gray-800 dark:text-foreground bg-transparent placeholder:text-gray-400 dark:placeholder:text-muted-foreground'
                />
                <button className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition duration-200'>
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* POPULAR SEARCHES */}
          <div className='flex flex-wrap items-center justify-center gap-3 text-sm'>
            <span className='text-gray-500 dark:text-muted-foreground'>Popular:</span>
            {activeCategories.map(
              (serviceCategories: TypeCategoryItem, index: string) => (
                <button
                  key={index}
                  onClick={() =>
                    router.push(
                      `/customer/service_category/${serviceCategories.serviceCategoryId}`
                    )
                  }
                  className='px-4 py-2 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-full text-gray-700 dark:text-foreground hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition'
                >
                  {serviceCategories.name}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      {/* ACTIVE SERVICE CATEGORIES  */}
      {!isLoading && activeCategories.length > 0 && (
        <section className='py-24 px-4 bg-white dark:bg-background'>
          <div className='max-w-7xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-foreground mb-4'>
                Popular Services
              </h2>
              <p className='text-xl text-gray-600 dark:text-muted-foreground'>
                Book the most in-demand home services
              </p>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
              {activeCategories.map((cat: TypeCategoryItem) => (
                <div
                  key={cat.serviceCategoryId}
                  onClick={() =>
                    router.push(
                      `/customer/service_category/${cat.serviceCategoryId}`
                    )
                  }
                  className='group cursor-pointer pb-1 text-center bg-gray-50 dark:bg-muted p-2 rounded-3xl'
                >
                  <div className='relative overflow-hidden rounded-2xl h-40 flex flex-col items-center justify-center transition-all duration-300 transform hover:-translate-y-2 shadow-md hover:shadow-xl'>
                    <Image
                      src={cat.bannerImage}
                      alt={cat.name}
                      sizes=''
                      fill
                      className='object-cover transition-transform duration-300 group-hover:scale-110'
                    />

                    <div className='absolute inset-0 bg-gradient-to-b from-black/40 to-black/20 group-hover:from-black/50 group-hover:to-black/40 transition-all'></div>

                    <span className='relative z-10 text-white font-semibold text-lg drop-shadow-md'>
                      {cat.name}
                    </span>
                  </div>
                  <div className="mt-2 text-gray-900 dark:text-foreground">
                    {cat.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* <div>
        <p>Testing Socket Notification</p>
        <div>
          <button
            onClick={() => createNotificationFunction()}
            className='px-3 py-1 bg-green-500'
          >
            create notifications
          </button>
        </div>
      </div> */}
      <section className='py-24 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-background dark:to-background'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-foreground mb-4'>
              Why Choose Fixora?
            </h2>
            <p className='text-xl text-gray-600 dark:text-muted-foreground'>
              Your satisfaction is our top priority
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {features.map((feature, idx) => (
              <div
                key={idx}
                className='group p-8 bg-white dark:bg-card rounded-2xl border border-gray-200 dark:border-border hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300'
              >
                <div className='w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                  <feature.icon className='text-white' size={28} />
                </div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-foreground mb-3'>
                  {feature.title}
                </h3>
                <p className='text-gray-600 dark:text-muted-foreground leading-relaxed'>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='relative py-24 px-4 overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700'></div>

        <div className='relative z-10 max-w-4xl mx-auto text-center text-white'>
          <h2 className='text-4xl md:text-6xl font-bold mb-6'>
            Ready to Get Started?
          </h2>
          <p className='text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed'>
            Join thousands of satisfied customers who trust Fixora for their
            home service needs
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <button className='group relative px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200'>
              <span className='relative z-10'>Book a Service Now</span>
            </button>
            <button className='px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200'>
              Become a Professional
            </button>
          </div>

          <div className='mt-16 flex flex-wrap justify-center gap-12 text-center'>
            <div>
              <div className='text-4xl font-bold mb-2'>50K+</div>
              <div className='text-blue-200'>Happy Customers</div>
            </div>
            <div>
              <div className='text-4xl font-bold mb-2'>2,500+</div>
              <div className='text-blue-200'>Verified Pros</div>
            </div>
            <div>
              <div className='text-4xl font-bold mb-2'>4.8★</div>
              <div className='text-blue-200'>Average Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
