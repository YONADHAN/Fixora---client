import Link from 'next/link'
import { CheckCircle, Users, Shield, Star, ArrowRight } from 'lucide-react'

export default function AboutUsPage() {
  const values = [
    {
      icon: CheckCircle,
      title: 'Quality First',
      desc: 'Every professional on Fixora is background-verified and skill-assessed before onboarding.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      desc: 'We connect local professionals with customers who need them — strengthening communities one job at a time.',
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      desc: 'End-to-end booking protection, secure payments, and dispute resolution built in.',
    },
    {
      icon: Star,
      title: 'Trusted Reviews',
      desc: 'Transparent ratings from real customers help you make confident choices every time.',
    },
  ]

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-background'>

      {/* Hero */}
      <section className='bg-[#0b2053] text-white py-24 px-6'>
        <div className='max-w-4xl mx-auto text-center space-y-6'>
          <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight'>
            About Fixora
          </h1>
          <p className='text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed'>
            We started with a simple belief: finding a trustworthy professional
            for your home or office should be effortless. Fixora makes that
            belief a reality.
          </p>
          <Link
            href='/#categories'
            className='inline-flex items-center gap-2 mt-4 px-6 py-3 bg-white text-[#0b2053] font-semibold rounded-full hover:bg-blue-50 transition-colors shadow-sm'
          >
            Browse Services <ArrowRight className='w-4 h-4' />
          </Link>
        </div>
      </section>

      {/* Mission */}
      <section className='py-20 px-6 bg-white dark:bg-slate-900'>
        <div className='max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center'>
          <div className='space-y-5'>
            <h2 className='text-3xl font-bold text-slate-900 dark:text-slate-100'>
              Our Mission
            </h2>
            <p className='text-slate-600 dark:text-slate-400 leading-relaxed text-base'>
              Fixora was built to eliminate the friction between skilled
              professionals and the people who need them. Whether it&apos;s
              plumbing, electrical work, AC repair, or cleaning — we bring the
              right expert to your door at the right time.
            </p>
            <p className='text-slate-600 dark:text-slate-400 leading-relaxed text-base'>
              Based in Kochi, Kerala, we are growing across India — one verified
              booking at a time.
            </p>
          </div>
          <div className='rounded-3xl bg-slate-50 dark:bg-slate-800 p-8 border border-slate-100 dark:border-slate-700 space-y-4'>
            {[
              ['500+', 'Verified Professionals'],
              ['10,000+', 'Bookings Completed'],
              ['4.8 / 5', 'Average Rating'],
              ['15+', 'Service Categories'],
            ].map(([stat, label]) => (
              <div key={label} className='flex items-center justify-between'>
                <span className='text-2xl font-extrabold text-[#0b2053] dark:text-blue-400'>
                  {stat}
                </span>
                <span className='text-slate-500 dark:text-slate-400 text-sm'>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className='py-20 px-6 bg-slate-50 dark:bg-background'>
        <div className='max-w-5xl mx-auto'>
          <div className='text-center mb-14'>
            <h2 className='text-3xl font-bold text-slate-900 dark:text-slate-100'>
              What We Stand For
            </h2>
          </div>
          <div className='grid sm:grid-cols-2 gap-8'>
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className='bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-100 dark:border-slate-800 shadow-sm flex gap-5'
              >
                <div className='w-12 h-12 shrink-0 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400'>
                  <Icon className='w-6 h-6' strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className='font-semibold text-slate-900 dark:text-slate-100 mb-1'>
                    {title}
                  </h3>
                  <p className='text-slate-500 dark:text-slate-400 text-sm leading-relaxed'>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='py-20 px-6 bg-white dark:bg-slate-900'>
        <div className='max-w-3xl mx-auto text-center space-y-6'>
          <h2 className='text-3xl font-bold text-slate-900 dark:text-slate-100'>
            Ready to get started?
          </h2>
          <p className='text-slate-500 dark:text-slate-400 text-base'>
            Join thousands of customers who trust Fixora for their everyday
            service needs.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/customer/signin'
              className='px-7 py-3 bg-[#0b2053] text-white font-semibold rounded-full hover:bg-[#0d2a6b] transition-colors shadow'
            >
              Get Started
            </Link>
            <Link
              href='/'
              className='px-7 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}