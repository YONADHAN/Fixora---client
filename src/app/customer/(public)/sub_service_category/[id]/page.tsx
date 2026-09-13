'use client'
import { useRouter, useParams } from 'next/navigation'
import { useState, useMemo } from 'react'
import { Pagination } from '@/components/shared-ui/resusable_components/pagination/pagination'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal, Search, X, Star, MapPin, Clock, Loader2, SearchX } from 'lucide-react'
import { useSearchServicesForCustomer } from '@/lib/hooks/useService'
import { useDebounce } from '@/lib/hooks/useDebounce'
import type {
  RequestSearchServicesForCustomerDTO,
  ResponseSearchServicesForCustomerItemDTO,
} from '@/dtos/service_dto'

const SearchPage = () => {
  const params = useParams()
  const id = params.id as string
  const [showFilter, setShowFilter] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
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
      search: debouncedSearch,
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
      debouncedSearch,
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

      <div className='border-b border-border/40 bg-background/80 sticky top-0 z-40 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex flex-col sm:flex-row items-center gap-4'>

            <div className='flex-1 w-full relative group'>
              <Search
                className='absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors'
                size={20}
              />
              <input
                type='text'
                placeholder='Search for services...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-full pl-12 pr-4 py-3.5 bg-card/50 hover:bg-card/80 border border-border/50 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-card transition-all shadow-sm'
              />
            </div>

            <Button
              onClick={() => setShowFilter(true)}
              variant={hasActiveFilters ? 'default' : 'outline'}
              className='w-full sm:w-auto h-12 px-6 rounded-full flex items-center gap-2 whitespace-nowrap shadow-sm hover:shadow transition-all'
            >
              <SlidersHorizontal size={18} />
              <span className="font-medium">Filters</span>
              {userLocation && (
                <span className="text-[10px] ml-1 bg-primary/20 text-primary-foreground px-2 py-0.5 rounded-full font-semibold">
                  {radius}km
                </span>
              )}
              {hasActiveFilters && (
                <span className='inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-accent text-accent-foreground ml-1'>
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
          <div className="flex flex-col items-center justify-center py-24 animate-in fade-in duration-500">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="mt-4 text-muted-foreground font-medium">Loading services...</p>
          </div>
        )}


        {isError && (
          <p className='text-center text-red-500'>Failed to load services.</p>
        )}


        {!isLoading && services.length === 0 && !isError && (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-in fade-in duration-500 bg-muted/20 rounded-2xl border border-dashed border-border/60">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
              <SearchX className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">No Services Found</h3>
            <p className="text-muted-foreground max-w-md">
              We couldn't find any services matching your current search or filters. Try adjusting your criteria to see more results.
            </p>
          </div>
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
  <div className='fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end'>
    <div className='bg-background/95 supports-[backdrop-filter]:bg-background/80 w-full max-w-md shadow-2xl flex flex-col h-full animate-in slide-in-from-right border-l border-border/50'>
      
      <div className='flex items-center justify-between p-6 border-b border-border/40'>
        <h2 className='text-2xl font-bold tracking-tight'>Filters</h2>
        <button
          onClick={close}
          className='p-2 hover:bg-muted rounded-full transition-colors active:scale-95'
        >
          <X size={20} />
        </button>
      </div>

      <div className='flex-1 overflow-y-auto p-6 space-y-8'>
        
        <div className="bg-card/50 p-5 rounded-2xl border border-border/50 shadow-sm">
          <label className='text-sm font-semibold block mb-4 flex items-center gap-2'>
            <MapPin size={16} className="text-primary" /> Location & Distance
          </label>
          <Button
            variant={usingLocation ? "default" : "outline"}
            className={`w-full justify-start gap-2 rounded-xl h-11 ${usingLocation ? 'bg-primary shadow-md' : 'border-border/50 hover:bg-muted/50'}`}
            onClick={onLocationClick}
          >
            <MapPin size={16} />
            {usingLocation ? "Using Current Location" : "Use Current Location"}
          </Button>

          {usingLocation && (
            <div className="mt-5 animate-in fade-in slide-in-from-top-2">
              <label className="text-xs font-medium text-muted-foreground mb-3 block uppercase tracking-wider">
                Search Radius
              </label>
              <div className="flex flex-wrap gap-2">
                {[2, 5, 10, 25, 50].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRadius(r)}
                    className={`text-xs py-2 px-3.5 rounded-full font-medium transition-all ${radius === r
                      ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20"
                      : "bg-muted hover:bg-muted/80 text-foreground border border-border/50"
                      }`}
                  >
                    {r}km
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className='text-xs text-muted-foreground mt-4 flex items-center gap-2 bg-muted/30 p-2.5 rounded-lg'>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Showing services within <strong className="text-foreground">{radius}km</strong> of you
          </p>
        </div>

        <div>
          <label className='text-sm font-semibold block mb-4'>Price Range</label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
              <input
                type='number'
                placeholder='Min'
                className='w-full pl-8 pr-4 py-3 bg-muted/30 hover:bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background transition-all text-sm'
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <span className="text-muted-foreground/50 font-medium">-</span>
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
              <input
                type='number'
                placeholder='Max'
                className='w-full pl-8 pr-4 py-3 bg-muted/30 hover:bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background transition-all text-sm'
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>
        </div>

        <div>
          <label className='text-sm font-semibold block mb-4'>Available Dates</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1.5 block">From</span>
              <input
                type='date'
                className='w-full px-4 py-3 bg-muted/30 hover:bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background transition-all text-sm'
                onChange={(e) => setAvailableFrom(e.target.value)}
              />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1.5 block">To</span>
              <input
                type='date'
                className='w-full px-4 py-3 bg-muted/30 hover:bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background transition-all text-sm'
                onChange={(e) => setAvailableTo(e.target.value)}
              />
            </div>
          </div>
        </div>

      </div>

      <div className='border-t border-border/40 p-6 space-y-3 bg-background/50 backdrop-blur-md'>
        <Button className='w-full h-12 rounded-xl text-base font-semibold shadow-md active:scale-95 transition-all' onClick={close}>
          Show Results
        </Button>
        <Button variant='outline' className='w-full h-12 rounded-xl font-medium border-border/50 hover:bg-muted/50 active:scale-95 transition-all' onClick={reset}>
          Reset Filters
        </Button>
      </div>
    </div>
  </div>
)

import Image from 'next/image'

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
    <div className='group flex flex-col bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-md hover:border-border transition-all duration-300 overflow-hidden'>
      <div className='h-52 relative w-full overflow-hidden'>
        <Image
          src={service.mainImage}
          alt={service.name || 'Service thumbnail'}
          fill
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out'
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className='p-6 flex flex-col flex-1'>
        <div className="flex justify-between items-start mb-2">
          <span className='px-2.5 py-1 text-[10px] font-bold text-primary bg-primary/10 rounded-full uppercase tracking-wider'>
            {service.subServiceCategory?.name}
          </span>
        </div>

        <h3 className='text-xl font-bold mt-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors'>{service.name}</h3>

        <p className='text-sm text-muted-foreground line-clamp-2 mt-2.5 leading-relaxed'>
          {service.description}
        </p>

        <div className='flex items-center gap-4 mt-4 pb-4 border-b border-border/50 text-xs font-medium text-muted-foreground'>
          <div className='flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md'>
            <Clock size={14} className="text-foreground/70" />
            <span>{service.schedule.slotDurationMinutes}m</span>
          </div>
          <div className='flex items-center gap-1.5 bg-accent/10 px-2 py-1 rounded-md text-accent'>
            <Star size={14} fill="currentColor" />
            <span className="font-semibold">4.8</span>
          </div>
        </div>
        
        <div className="mt-auto pt-4">
          <p className='text-xs text-muted-foreground mb-3 flex items-center gap-1.5'>
             By <span className='font-semibold text-foreground hover:text-primary transition-colors cursor-pointer'>{service.vendor?.name}</span>
          </p>

          <div className='flex items-center justify-between'>
            <div className="flex flex-col">
              <span className='text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5'>Starting at</span>
              <span className='text-2xl font-black text-foreground'>
                ₹{service.pricing.pricePerSlot}
              </span>
            </div>
            <Button
              size='sm'
              className="rounded-full px-5 font-semibold shadow-sm hover:shadow transition-all"
              onClick={() => navigateToServiceDetails(service.serviceId)}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
