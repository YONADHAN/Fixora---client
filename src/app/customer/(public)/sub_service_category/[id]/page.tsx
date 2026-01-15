'use client'
import { useRouter, useParams } from 'next/navigation'
import { useState, useMemo } from 'react'
import { Pagination } from '@/components/shared-ui/resusable_components/pagination/pagination'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal, Search, X, Star, Clock } from 'lucide-react'
import { useSearchServicesForCustomer } from '@/lib/hooks/useService'
import type {
  RequestSearchServicesForCustomerDTO,
  ResponseSearchServicesForCustomerItemDTO,
} from '@/dtos/service_dto'

const SearchPage = () => {
  const params = useParams()
  const id = params.id as string
  const [showFilter, setShowFilter] = useState(false)
  const [search, setSearch] = useState('')
  const [minPrice, setMinPrice] = useState<number | undefined>()
  const [maxPrice, setMaxPrice] = useState<number | undefined>()
  const [recurrenceType, setRecurrenceType] = useState<
    'daily' | 'weekly' | 'monthly' | ''
  >('')
  const [weeklyDays, setWeeklyDays] = useState<number[]>([])
  const [availableFrom, setAvailableFrom] = useState('')
  const [availableTo, setAvailableTo] = useState('')
  const [workStartTime, setWorkStartTime] = useState('')
  const [workEndTime, setWorkEndTime] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  /* ---------------------------------------
     BUILD PAYLOAD FOR API
  ----------------------------------------*/
  const payload: RequestSearchServicesForCustomerDTO = useMemo(
    () => ({
      subServiceCategoryId: id,
      page: currentPage,
      limit: 4,
      search,
      minPrice,
      maxPrice,
      availableFrom: availableFrom ? new Date(availableFrom) : undefined,
      availableTo: availableTo ? new Date(availableTo) : undefined,
      workStartTime: workStartTime || undefined,
      workEndTime: workEndTime || undefined,
      recurrenceType: recurrenceType || undefined,
      weeklyDays: weeklyDays.length ? weeklyDays : undefined,
    }),
    [
      id,
      search,
      minPrice,
      maxPrice,
      recurrenceType,
      weeklyDays,
      availableFrom,
      availableTo,
      workStartTime,
      workEndTime,
      currentPage,
    ]
  )

  /* ---------------------------------------
     API CALL
  ----------------------------------------*/
  const { data, isLoading, isError } = useSearchServicesForCustomer(payload)
  const router = useRouter()
  const services = data?.data ?? []
  const totalPages = data?.totalPages ?? 1

  const toggleWeeklyDay = (day: number) => {
    setWeeklyDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const hasActiveFilters =
    minPrice ||
    maxPrice ||
    recurrenceType ||
    weeklyDays.length > 0 ||
    availableFrom ||
    availableTo ||
    workStartTime ||
    workEndTime

  return (
    <div className='min-h-screen bg-background'>
      {/* 🔍 SEARCH + FILTER BAR */}
      <div className='border-b border-border bg-card sticky top-0 z-40 backdrop-blur-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex items-center gap-3'>
            {/* SEARCH INPUT */}
            <div className='flex-1 relative'>
              <Search
                className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
                size={20}
              />
              <input
                type='text'
                placeholder='Search services...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all'
              />
            </div>

            {/* FILTER BUTTON */}
            <Button
              onClick={() => setShowFilter(true)}
              variant={hasActiveFilters ? 'default' : 'outline'}
              className='flex items-center gap-2 whitespace-nowrap'
            >
              <SlidersHorizontal size={18} />
              Filters
              {hasActiveFilters && (
                <span className='inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-accent text-accent-foreground'>
                  !
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* FILTER SIDEBAR */}
      {showFilter && (
        <FilterSidebar
          close={() => setShowFilter(false)}
          reset={() => {
            setMinPrice(undefined)
            setMaxPrice(undefined)
            setRecurrenceType('')
            setWeeklyDays([])
            setAvailableFrom('')
            setAvailableTo('')
            setWorkStartTime('')
            setWorkEndTime('')
          }}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          recurrenceType={recurrenceType}
          setRecurrenceType={setRecurrenceType}
          weeklyDays={weeklyDays}
          toggleWeeklyDay={toggleWeeklyDay}
          setAvailableFrom={setAvailableFrom}
          setAvailableTo={setAvailableTo}
          setWorkStartTime={setWorkStartTime}
          setWorkEndTime={setWorkEndTime}
        />
      )}

      {/* MAIN CONTENT */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* LOADING */}
        {isLoading && (
          <p className='text-center text-muted-foreground'>
            Loading services...
          </p>
        )}

        {/* ERROR */}
        {isError && (
          <p className='text-center text-red-500'>Failed to load services.</p>
        )}

        {/* EMPTY STATE */}
        {!isLoading && services.length === 0 && (
          <p className='text-center text-muted-foreground'>
            No services found with selected filters.
          </p>
        )}

        {/* SERVICE GRID */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12'>
          {services.map((service) => (
            <ServiceCard key={service.serviceId} service={service} />
          ))}
        </div>

        {/* PAGINATION */}
        <div className='flex justify-center'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      </div>
    </div>
  )
}

export default SearchPage

/* -------------------------------
   FILTER SIDEBAR (Extracted)
--------------------------------*/
const FilterSidebar = ({
  close,
  reset,
  setMinPrice,
  setMaxPrice,
  recurrenceType,
  setRecurrenceType,
  weeklyDays,
  toggleWeeklyDay,
  setAvailableFrom,
  setAvailableTo,
  setWorkStartTime,
  setWorkEndTime,
}: any) => (
  <div className='fixed inset-0 bg-black/50 z-40 flex pt-12'>
    <div className='bg-card w-full max-w-md ml-auto shadow-xl flex flex-col h-full animate-in slide-in-from-right'>
      {/* Header */}
      <div className='flex items-center justify-between p-6 border-b border-border'>
        <h2 className='text-xl font-bold text-foreground'>Filters</h2>
        <button
          onClick={close}
          className='p-2 hover:bg-muted rounded-lg transition-colors'
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className='flex-1 overflow-y-auto p-6 space-y-6'>
        {/* Price Range */}
        <div>
          <label className='text-sm font-semibold block mb-4'>
            Price Range
          </label>
          <input
            type='number'
            placeholder='Min Price'
            className='input'
            onChange={(e) =>
              setMinPrice(e.target.value ? Number(e.target.value) : undefined)
            }
          />
          <input
            type='number'
            placeholder='Max Price'
            className='input mt-3'
            onChange={(e) =>
              setMaxPrice(e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>

        {/* Recurrence Type */}
        <div>
          <label className='text-sm font-semibold block mb-4'>Frequency</label>
          <select
            className='input'
            value={recurrenceType}
            onChange={(e) => setRecurrenceType(e.target.value as any)}
          >
            <option value=''>Any</option>
            <option value='daily'>Daily</option>
            <option value='weekly'>Weekly</option>
            <option value='monthly'>Monthly</option>
          </select>
        </div>

        {/* Weekly Days */}
        <div>
          <label className='text-sm font-semibold block mb-4'>Days</label>
          <div className='grid grid-cols-4 gap-2'>
            {[0, 1, 2, 3, 4, 5, 6].map((day) => (
              <button
                key={day}
                onClick={() => toggleWeeklyDay(day)}
                className={`day-btn ${weeklyDays.includes(day) ? 'active' : ''
                  }`}
              >
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'][day]}
              </button>
            ))}
          </div>
        </div>

        {/* Dates */}
        <div>
          <label className='text-sm font-semibold block mb-4'>
            Available Dates
          </label>
          <input
            type='date'
            className='input'
            onChange={(e) => setAvailableFrom(e.target.value)}
          />
          <input
            type='date'
            className='input mt-3'
            onChange={(e) => setAvailableTo(e.target.value)}
          />
        </div>

        {/* Working Hours */}
        <div>
          <label className='text-sm font-semibold block mb-4'>
            Working Hours
          </label>
          <input
            type='time'
            className='input'
            onChange={(e) => setWorkStartTime(e.target.value)}
          />
          <input
            type='time'
            className='input mt-3'
            onChange={(e) => setWorkEndTime(e.target.value)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className='border-t border-border p-6 space-y-3 bg-card'>
        <Button className='w-full' onClick={close}>
          Apply Filters
        </Button>
        <Button variant='outline' className='w-full' onClick={reset}>
          Clear All
        </Button>
      </div>
    </div>
  </div>
)

/* -------------------------------
   SERVICE CARD (unchanged)
--------------------------------*/
const ServiceCard = ({
  service,
}: {
  service: ResponseSearchServicesForCustomerItemDTO
}) => {
  const router = useRouter()
  const navigateToServiceDetails = (id: string) => {
    router.push(`/customer/service/${id}`)
  }

  return (
    <div className='group bg-card border border-border rounded-xl shadow-sm hover:shadow-lg transition-all'>
      <div className='h-48 overflow-hidden rounded-t-xl'>
        <img
          src={service.mainImage}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform'
        />
      </div>

      <div className='p-5'>
        <p className='text-xs font-semibold text-primary uppercase tracking-wide'>
          {service.subServiceCategory?.name}
        </p>

        <h3 className='text-lg font-bold mt-2 line-clamp-2'>{service.name}</h3>

        <p className='text-sm text-muted-foreground line-clamp-2 mt-2'>
          {service.description}
        </p>

        <div className='flex items-center gap-4 mt-4 pb-3 border-b text-xs text-muted-foreground'>
          <div className='flex items-center gap-1'>
            <Clock size={14} />
            <span>{service.schedule.slotDurationMinutes}m</span>
          </div>
          <div className='flex items-center gap-1'>
            <Star size={14} className='text-accent' />
            <span>4.8</span>
          </div>
        </div>

        <p className='text-xs mt-3'>
          By <span className='font-medium'>{service.vendor?.name}</span>
        </p>

        <div className='flex items-center justify-between mt-4'>
          <div>
            <p className='text-xs text-muted-foreground'>Starting at</p>
            <p className='text-2xl font-bold'>
              ₹{service.pricing.pricePerSlot}
            </p>
          </div>
          <Button
            size='sm'
            onClick={() => navigateToServiceDetails(service.serviceId)}
          >
            View Service
          </Button>
        </div>
      </div>
    </div>
  )
}
