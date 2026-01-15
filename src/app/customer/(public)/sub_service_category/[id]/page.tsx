'use client'
import { useRouter, useParams } from 'next/navigation'
import { useState, useMemo } from 'react'
import { Pagination } from '@/components/shared-ui/resusable_components/pagination/pagination'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal, Search, X, Star, MapPin, Clock } from 'lucide-react'
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
  const [availableFrom, setAvailableFrom] = useState('')
  const [availableTo, setAvailableTo] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [radius, setRadius] = useState<number>(50);

  const handleLocationClick = () => {
    if (userLocation) {
      setUserLocation(null);
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not access location. Please enable location permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

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
      latitude: userLocation?.lat,
      longitude: userLocation?.lng,
      radius: userLocation ? radius : undefined
    }),
    [
      id,
      search,
      minPrice,
      maxPrice,
      availableFrom,
      availableTo,
      userLocation,
      radius,
      currentPage,
    ]
  )

  const { data, isLoading, isError } = useSearchServicesForCustomer(payload)
  const router = useRouter()
  const services = data?.data ?? []
  const totalPages = data?.totalPages ?? 1


  const hasActiveFilters =
    minPrice ||
    maxPrice ||
    availableFrom ||
    availableTo ||
    userLocation

  return (
    <div className='min-h-screen bg-background'>

      <div className='border-b border-border bg-card sticky top-0 z-40 backdrop-blur-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex items-center gap-3'>

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


            <Button
              onClick={() => setShowFilter(true)}
              variant={hasActiveFilters ? 'default' : 'outline'}
              className='flex items-center gap-2 whitespace-nowrap'
            >
              <SlidersHorizontal size={18} />
              Filters
              {userLocation && (
                <span className="text-[10px] ml-1 bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                  {radius}km
                </span>
              )}
              {hasActiveFilters && (
                <span className='inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-accent text-accent-foreground ml-1'>
                  !
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>


      {showFilter && (
        <FilterSidebar
          close={() => setShowFilter(false)}
          reset={() => {
            setMinPrice(undefined)
            setMaxPrice(undefined)
            setAvailableFrom('')
            setAvailableTo('')
            setUserLocation(null)
            setRadius(50)
          }}
          usingLocation={!!userLocation}
          onLocationClick={handleLocationClick}
          radius={radius}
          setRadius={setRadius}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          setAvailableFrom={setAvailableFrom}
          setAvailableTo={setAvailableTo}
        />
      )}


      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>

        {isLoading && (
          <p className='text-center text-muted-foreground'>
            Loading services...
          </p>
        )}


        {isError && (
          <p className='text-center text-red-500'>Failed to load services.</p>
        )}


        {!isLoading && services.length === 0 && (
          <p className='text-center text-muted-foreground'>
            No services found with selected filters.
          </p>
        )}


        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12'>
          {services.map((service) => (
            <ServiceCard key={service.serviceId} service={service} />
          ))}
        </div>


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

// FilterSidebar
const FilterSidebar = ({
  close,
  reset,
  setMinPrice,
  setMaxPrice,
  setAvailableFrom,
  setAvailableTo,
  onLocationClick,
  usingLocation,
  radius,
  setRadius
}: any) => (
  <div className='fixed inset-0 bg-black/50 z-40 flex pt-12'>
    <div className='bg-card w-full max-w-md ml-auto shadow-xl flex flex-col h-full animate-in slide-in-from-right'>

      <div className='flex items-center justify-between p-6 border-b border-border'>
        <h2 className='text-xl font-bold text-foreground'>Filters</h2>
        <button
          onClick={close}
          className='p-2 hover:bg-muted rounded-lg transition-colors'
        >
          <X size={20} />
        </button>
      </div>


      <div className='flex-1 overflow-y-auto p-6 space-y-6'>


        <div className="bg-muted/30 p-4 rounded-xl border border-border">
          <label className='text-sm font-semibold block mb-4'>
            Location & Distance
          </label>
          <Button
            variant={usingLocation ? "default" : "outline"}
            className={`w-full justify-start gap-2 ${usingLocation ? 'bg-primary text-primary-foreground' : ''}`}
            onClick={onLocationClick}
          >
            <MapPin size={16} />
            {usingLocation ? "Using Current Location" : "Use Current Location"}
          </Button>

          {usingLocation && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2">
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Search Radius
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[2, 5, 10, 25, 50].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRadius(r)}
                    className={`text-xs py-1.5 px-1 rounded-md transition-all border ${radius === r
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted border-input"
                      }`}
                  >
                    {r}km
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className='text-xs text-muted-foreground mt-3 flex items-center gap-1.5'>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Showing services within <strong>{radius}km</strong> of you
          </p>
        </div>



        <div>
          <label className='text-sm font-semibold block mb-4'>
            Price Range
          </label>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
              <input
                type='number'
                placeholder='Min'
                className='input pl-7'
                onChange={(e) =>
                  setMinPrice(e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </div>
            <span className="text-muted-foreground">-</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
              <input
                type='number'
                placeholder='Max'
                className='input pl-7'
                onChange={(e) =>
                  setMaxPrice(e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </div>
          </div>
        </div>


        <div>
          <label className='text-sm font-semibold block mb-4'>
            Available Dates
          </label>
          <div className="space-y-3">
            <div>
              <span className="text-xs text-muted-foreground mb-1 block">From</span>
              <input
                type='date'
                className='input w-full'
                onChange={(e) => setAvailableFrom(e.target.value)}
              />
            </div>
            <div>
              <span className="text-xs text-muted-foreground mb-1 block">To</span>
              <input
                type='date'
                className='input w-full'
                onChange={(e) => setAvailableTo(e.target.value)}
              />
            </div>
          </div>
        </div>

      </div>


      <div className='border-t border-border p-6 space-y-3 bg-card'>
        <Button className='w-full' onClick={close}>
          Show Results
        </Button>
        <Button variant='outline' className='w-full' onClick={reset}>
          Reset Filters
        </Button>
      </div>
    </div>
  </div>
)

// ServiceCard
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
