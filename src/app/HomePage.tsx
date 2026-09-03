'use client'

import {
  CheckCircle,
  Clock,
  Shield,
  Star,
  Search,
  CalendarCheck,
  Wrench,
  ArrowRight
} from 'lucide-react'
import Image from 'next/image'
import { useGetActiveServiceCategories } from '@/lib/hooks/userServiceCategory'
import { useRouter } from 'next/navigation'

interface TypeCategoryItem {
  serviceCategoryId: string
  name: string
  description: string
  bannerImage: string
}

export default function Page() {
  const router = useRouter()
  const { data, isLoading } = useGetActiveServiceCategories()
  const activeCategories = data?.data?.data?.data || []

  const features = [
    {
      icon: CheckCircle,
      title: 'Verified Professionals',
      desc: 'All service providers undergo background verification.',
    },
    {
      icon: Clock,
      title: 'Quick Booking',
      desc: 'Schedule services at a time that works for you.',
    },
    {
      icon: Shield,
      title: 'Service Guarantee',
      desc: 'Your satisfaction is prioritized through our service standards.',
    },
    {
      icon: Star,
      title: 'Top Rated',
      desc: 'Connect with professionals maintaining high customer ratings.',
    },
  ]

  const workflows = [
    {
      icon: Search,
      title: 'Discover Services',
      desc: 'Browse our categories to find the specific professional service you require.',
    },
    {
      icon: CalendarCheck,
      title: 'Book an Appointment',
      desc: 'Select your preferred service provider and schedule a convenient time.',
    },
    {
      icon: Wrench,
      title: 'Service Completion',
      desc: 'The professional arrives at your location to complete the requested job.',
    },
  ]

  return (
    <div className='flex flex-col min-h-screen bg-slate-50 dark:bg-background'>

      {/* HERO SECTION */}
      <section className='relative  mt-[64px] md:mt-[3px] pt-16 pb-40 lg:pt-10 lg:pb-56 px-6  dark:bg-background overflow-hidden min-h-[600px] lg:min-h-[800px] flex items-center'>

        {/* Full width background image */}
        <div className="absolute inset-0 z-0 md:">
          <Image
            src="/hero.png"
            alt="Professionals"
            fill
            className="object-cover md:object-center object-right"
            priority
          />
          {/* Subtle gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r md:from-white/90 md:via-white/30  to-transparent dark:from-slate-950/95 dark:via-slate-950/70 dark:to-transparent" />
        </div>

        <div className='max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12'>
          <div className='space-y-6 text-center lg:text-left pt-24 lg:pt-0'>

            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 mb-2 shadow-sm">
              <Shield className="w-4 h-4 text-[#0b2053] dark:text-blue-400" />
              <span className="text-sm font-bold text-[#0b2053] dark:text-blue-200 tracking-wide">
                Trusted Professionals. Quality Service.
              </span>
            </div>

            <h1 className='text-4xl md:text-5xl lg:text-[4.5rem] font-extrabold tracking-tight text-white md:text-[#0b2053] dark:text-white leading-[1.1] drop-shadow-sm'>
              Find the right professional <br className='hidden lg:block' /> for the job.
            </h1>

            <p className='text-lg md:text-xl text-white md:text-slate-700 dark:text-slate-200 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium drop-shadow-sm'>
              Discover and book trusted local professionals for all your service needs.
            </p>
          </div>
        </div>

       

        {/* Wave SVG separator positioned at the bottom of hero */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
          <svg className="relative block w-full h-[60px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.06,130.83,120.22,192.65,108.99c60.31-10.96,116-35.32,176.62-43.14Z" className="fill-white dark:fill-slate-900"></path>
          </svg>
        </div>
      </section>

      {/* FEATURES SECTION (Overlapping Wave) */}
      <section className='relative z-20 -mt-16  md:-mt-24 px-6 pb-24'>
        <div className='max-w-7xl mx-auto'>
          <div className='bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100 dark:border-slate-800 p-8 md:p-12'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800'>
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-4 ${idx !== 0 ? 'pt-8 md:pt-0 md:pl-8 lg:pl-10' : ''}`}
                >
                  <div className='w-14 h-14 shrink-0 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center'>
                    <feature.icon className='w-7 h-7' strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className='text-base font-bold text-slate-900 dark:text-slate-100 mb-1'>
                      {feature.title}
                    </h3>
                    <p className='text-slate-500 dark:text-slate-400 text-sm leading-snug'>
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className='py-24 px-6 bg-white dark:bg-slate-900'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-20'>
            <h2 className='text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4'>
              How Fixora Works
            </h2>
          </div>

          <div className='grid md:grid-cols-3 gap-12 relative'>
            {/* Connecting line for desktop */}
            <div className='hidden md:block absolute top-10 left-1/6 right-1/6 h-[2px] border-t-2 border-dashed border-slate-200 dark:border-slate-700 z-0' style={{ width: '66%', left: '17%' }}></div>

            {workflows.map((step, idx) => (
              <div key={idx} className='flex flex-col items-center text-center relative z-10'>
                <div className='w-20 h-20 bg-white dark:bg-slate-900 border-4 border-slate-50 dark:border-slate-800 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6 shadow-sm'>
                  <step.icon className='w-8 h-8' strokeWidth={1.5} />
                </div>
                <h3 className='text-xl font-bold text-slate-900 dark:text-slate-100 mb-3'>
                  {idx + 1}. {step.title}
                </h3>
                <p className='text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-xs'>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACTIVE SERVICE CATEGORIES */}
      {!isLoading && activeCategories.length > 0 && (
        <section id="categories" className='py-24 px-6 bg-slate-50 dark:bg-background'>
          <div className='max-w-7xl mx-auto'>
            <div className='flex flex-col mb-12 gap-4 text-center'>
              <h2 className='text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4'>
                Service Categories
              </h2>
              <p className='text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto'>
                Explore the range of services offered by our professionals.
              </p>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
              {activeCategories.map((cat: TypeCategoryItem) => (
                <div
                  key={cat.serviceCategoryId}
                  onClick={() => router.push(`/customer/service_category/${cat.serviceCategoryId}`)}
                  className='group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col'
                >
                  <div className='relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800'>
                    {cat.bannerImage ? (
                      <Image
                        src={cat.bannerImage}
                        alt={cat.name}
                        fill
                        className='object-cover transition-transform duration-500 group-hover:scale-105'
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                        <Wrench className="w-8 h-8 opacity-50" />
                      </div>
                    )}
                  </div>
                  <div className='p-6 flex flex-col flex-grow'>
                    <h3 className='text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                      {cat.name}
                    </h3>
                    <p className='text-slate-500 dark:text-slate-400 text-sm line-clamp-2'>
                      {cat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CALL TO ACTION */}
      <section className='py-24 px-6 bg-slate-50 dark:bg-background'>
        <div className='max-w-7xl mx-auto'>
          <div className='relative rounded-[2.5rem] overflow-hidden bg-[#0b2053] shadow-2xl flex flex-col lg:flex-row'>
            <div className='p-12 md:p-16 lg:p-20 flex-1 relative z-10 flex flex-col justify-center text-center lg:text-left'>
              <h2 className='text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight'>
                Ready to find the right professional?
              </h2>
              <p className='text-lg md:text-xl text-blue-100 max-w-2xl mx-auto lg:mx-0 mb-10'>
                Whether you are looking for a service or offering your professional skills, get started with Fixora today.
              </p>

              <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center'>
                <button
                  onClick={() => router.push('/vendor/signin')}
                  className='px-8 py-4 bg-white text-[#0b2053] hover:bg-slate-100 rounded-full font-bold transition-colors shadow-sm w-full sm:w-auto text-base'
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/vendor/signup')}
                  className='px-8 py-4 bg-transparent border-2 border-white/30 text-white hover:bg-white/10 rounded-full font-bold transition-colors w-full sm:w-auto text-base'
                >
                  Become a Professional
                </button>
              </div>
            </div>

            <div className='relative w-full lg:w-5/12 min-h-[300px] lg:min-h-full hidden md:block'>
              {/* Gradient mask to blend image seamlessly into the card background */}
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0b2053] via-[#0b2053]/50 to-transparent z-10"></div>
              <Image
                src="/hero.png"
                alt="Join Fixora Professionals"
                fill
                className="object-cover object-right"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
