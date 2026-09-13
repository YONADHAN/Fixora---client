'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Clock, MapPin, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

import {
  useCreateBookingHold,
  useGetAvailableSlotsForCustomer,
} from '@/lib/hooks/useBooking'
import { useAddresses } from '@/lib/hooks/useAddress'
import { useGetServicesById } from '@/lib/hooks/useService'
import { AddressSelector } from './address_selector'

import { AxiosError } from 'axios'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { RootState } from '@/store/store'
import SignInModal from './signIn_modal'

/* ───────────────── TYPES ───────────────── */

type Slot = {
  start: string
  end: string
}

/* ───────────────── COMPONENT ───────────────── */

export default function BookServicePage() {
  const params = useParams()
  const serviceId = params.id as string
  const router = useRouter()

  /* ───────────── State ───────────── */
  const customer = useSelector((state: RootState) => state.customer.customer)
  const authenticated = !!customer

  /* ───────────── Calendar State ───────────── */

  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const [showLoginModal, setShowLoginModal] = useState(false)
  // const [pendingPayment, setPendingPayment] = useState(false)

  /* ───────────── Slot State ───────────── */

  const [selectedSlotStart, setSelectedSlotStart] = useState<string | null>(
    null
  )

  /* ───────────── Variant State (OPTIONAL) ───────────── */

  const [selectedVariantIndex, setSelectedVariantIndex] = useState<
    number | null
  >(null)

  /* ───────────── Payment State ───────────── */

  const [paymentMethod, setPaymentMethod] = useState<'stripe'>('stripe')

  /* ───────────── APIs ───────────── */

  const {
    data: slotsByDate = {},
    isLoading,
    isError,
  } = useGetAvailableSlotsForCustomer({
    serviceId,
    year: year.toString(),
    month: month.toString(),
  })

  const {
    data: service,
    isLoading: isServiceLoading,
    isError: isServiceError,
  } = useGetServicesById({ serviceId })

  const { data: addressData } = useAddresses(
    { page: 1, limit: 100 },
    { enabled: authenticated }
  )
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)

  const { mutate: createHold } = useCreateBookingHold()
  /* ───────────── Derived Data ───────────── */

  const availableDates = Object.keys(slotsByDate)

  const hasVariants =
    service?.serviceVariants && service.serviceVariants.length > 0

  const selectedVariant =
    hasVariants && selectedVariantIndex !== null
      ? service!.serviceVariants![selectedVariantIndex]
      : null

  const basePrice = service?.pricing.pricePerSlot ?? 0
  const baseAdvance = service?.pricing.advanceAmountPerSlot ?? 0

  // variant is OPTIONAL
  const effectivePricePerSlot = selectedVariant?.price ?? basePrice
  const effectiveAdvancePerSlot = baseAdvance

  // Single Slot Logic
  const totalPrice = selectedSlotStart ? effectivePricePerSlot : 0
  const totalAdvance = selectedSlotStart ? effectiveAdvancePerSlot : 0

  /* ───────────── Effects ───────────── */

  useEffect(() => {
    if (availableDates.length > 0) setSelectedDate(availableDates[0])
    else setSelectedDate(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month, availableDates.length])

  const slotsForSelectedDate: Slot[] =
    selectedDate && slotsByDate[selectedDate] ? slotsByDate[selectedDate] : []

  /* ───────────── Slot Actions ───────────── */

  const handleSlotClick = (start: string) => {
    if (selectedSlotStart === start) {
      setSelectedSlotStart(null) // deselect
    } else {
      setSelectedSlotStart(start)
    }
  }

  const getSelectedSlotDetails = () => {
    if (!selectedDate || !selectedSlotStart) return null
    const slot = slotsByDate[selectedDate]?.find(s => s.start === selectedSlotStart)
    if (!slot) return null
    return {
      date: selectedDate,
      start: slot.start,
      end: slot.end,
      variant: selectedVariant
        ? {
          name: selectedVariant.name,
          price: selectedVariant.price,
        }
        : undefined,
    }
  }

  const selectedSlot = getSelectedSlotDetails()


  /* ───────────── Month Navigation ───────────── */

  const goPrevMonth = () => {
    setSelectedDate(null)
    setSelectedSlotStart(null)

    if (month === 0) {
      setMonth(11)
      setYear((y) => y - 1)
    } else {
      setMonth((m) => m - 1)
    }
  }

  const goNextMonth = () => {
    setSelectedDate(null)
    setSelectedSlotStart(null)

    if (month === 11) {
      setMonth(0)
      setYear((y) => y + 1)
    } else {
      setMonth((m) => m + 1)
    }
  }

  /* ───────────── Payment ───────────── */

  const PayAdvanceButtonClick = () => {
    if (!selectedSlot) {
      toast.error('Please select a slot')
      return
    }

    if (hasVariants && selectedVariantIndex === null) {
      toast.error('Please select a variant or choose No Variant')
      return
    }

    if (!customer) {
      // setPendingPayment(true)
      setShowLoginModal(true)
      return
    }

    if (!selectedAddressId) {
      toast.error('Please select an address')
      const element = document.getElementById('address-section')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }

    const formattedSlots = [{
      date: selectedSlot.date,
      start: selectedSlot.start,
      end: selectedSlot.end,
      pricePerSlot: effectivePricePerSlot,
      advancePerSlot: effectiveAdvancePerSlot,
      variant: selectedSlot.variant,
    }]

    createHold(
      {
        serviceId,
        paymentMethod,
        slots: formattedSlots,
        addressId: selectedAddressId,
      },
      {
        onSuccess: (data) => {
          console.log('Booking hold created:', data)
          router.push(`/customer/booking/payment/${data.holdId}`)
        },
        onError: (error: unknown) => {
          if (error instanceof AxiosError)
            toast.error(error.response?.data?.message)
        },
      }
    )
  }

  /* ───────────── Guards ───────────── */

  if (isLoading || isServiceLoading) return <p className='p-6'>Loading…</p>
  if (isError || isServiceError || !service)
    return <p className='p-6'>Error loading data</p>



  const isSlotInPast = (date: Date, startTime: string) => {
    const now = new Date()

    const [hours, minutes] = startTime.split(':').map(Number)

    const slotDateTime = new Date(date)
    slotDateTime.setHours(hours, minutes, 0, 0)

    return slotDateTime <= now
  }

  const isDateInPast = (dateStr: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const date = new Date(dateStr)
    date.setHours(0, 0, 0, 0)

    return date < today
  }

  return (
    <div className='max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 xl:gap-12 animate-in fade-in duration-500'>
      <SignInModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setShowLoginModal(false)
        }}
      />

      {/* ───────────── LEFT ───────────── */}
      <div className='space-y-8'>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Book Service</h1>
          <p className="text-muted-foreground font-medium">Select a date and time that works best for you.</p>
        </div>

        {/* Calendar */}
        <Card className='p-6 rounded-2xl border-none shadow-sm ring-1 ring-border/50 bg-card'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-lg font-semibold tracking-tight'>
              {new Date(year, month).toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </h2>
            <div className="flex items-center gap-2">
              <Button size='icon' variant='outline' className="h-8 w-8 rounded-full shadow-sm" onClick={goPrevMonth}>
                ‹
              </Button>
              <Button size='icon' variant='outline' className="h-8 w-8 rounded-full shadow-sm" onClick={goNextMonth}>
                ›
              </Button>
            </div>
          </div>

          <div className='grid grid-cols-7 gap-2 sm:gap-3'>
            {availableDates.filter((d) => !isDateInPast(d)).map((d) => (
              <Button
                key={d}
                variant={selectedDate === d ? 'default' : 'outline'}
                className={`h-12 sm:h-14 w-full rounded-xl font-semibold transition-all ${
                  selectedDate === d ? 'shadow-md scale-105' : 'hover:bg-muted text-muted-foreground'
                }`}
                onClick={() => {
                  setSelectedDate(d)
                  setSelectedSlotStart(null)
                }}
              >
                {new Date(d).getDate()}
              </Button>
            ))}
          </div>
        </Card>

        {/* Slots */}
        <Card className='p-6 rounded-2xl border-none shadow-sm ring-1 ring-border/50 bg-card'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-lg font-semibold tracking-tight flex items-center gap-2'>
              <Clock size={20} className="text-primary" /> Select Time Slot
            </h2>
            {selectedSlot && (
              <span className='text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full'>
                Selected: {selectedSlot.start}
              </span>
            )}
          </div>

          <div className='grid grid-cols-3 sm:grid-cols-4 gap-3 mb-2'>
            {slotsForSelectedDate.map((slot) => {
              const slotDate = selectedDate ? new Date(selectedDate) : null
              const disabled = !slotDate || isSlotInPast(slotDate, slot.start)

              return (
                <Button
                  key={slot.start}
                  disabled={disabled}
                  variant={selectedSlotStart === slot.start ? 'default' : 'outline'}
                  className={`h-14 rounded-xl transition-all ${
                    selectedSlotStart === slot.start ? 'shadow-md scale-105' : ''
                  }`}
                  onClick={() => !disabled && handleSlotClick(slot.start)}
                >
                  <div className="flex flex-col items-center">
                    <span className="font-bold">{slot.start}</span>
                    <span className="text-[10px] font-medium opacity-80">{slot.end}</span>
                  </div>
                </Button>
              )
            })}
          </div>
          {slotsForSelectedDate.length === 0 && (
            <div className='py-8 text-center bg-muted/20 rounded-xl border border-dashed border-border/60 mt-4'>
              <p className='text-muted-foreground font-medium'>No slots available for this date.</p>
            </div>
          )}
        </Card>

        {/* Variant */}
        {hasVariants && (
          <Card className='p-6 rounded-2xl border-none shadow-sm ring-1 ring-border/50 bg-card'>
            <h2 className='text-lg font-semibold tracking-tight mb-4'>
              Select Service Variant <span className="text-muted-foreground font-normal text-sm">(Optional)</span>
            </h2>

            <div className='grid sm:grid-cols-2 gap-3'>
              <Button
                variant={selectedVariantIndex === null ? 'default' : 'outline'}
                className={`h-16 justify-between px-5 rounded-xl transition-all ${
                  selectedVariantIndex === null ? 'shadow-md ring-2 ring-primary ring-offset-2' : ''
                }`}
                onClick={() => setSelectedVariantIndex(null)}
              >
                <span className="font-semibold text-base">No Variant</span>
                <span className='text-sm font-bold opacity-90'>₹{basePrice}</span>
              </Button>
              {service.serviceVariants!.map((variant, idx) => (
                <Button
                  key={idx}
                  variant={selectedVariantIndex === idx ? 'default' : 'outline'}
                  className={`h-16 justify-between px-5 rounded-xl transition-all ${
                    selectedVariantIndex === idx ? 'shadow-md ring-2 ring-primary ring-offset-2' : ''
                  }`}
                  onClick={() => setSelectedVariantIndex(idx)}
                >
                  <span className="font-semibold text-base truncate pr-2">{variant.name}</span>
                  {variant.price && <span className="text-sm font-bold opacity-90 shrink-0">₹{variant.price}</span>}
                </Button>
              ))}
            </div>
          </Card>
        )}

        {/* Address Selection */}
        <Card className='p-6 rounded-2xl border-none shadow-sm ring-1 ring-border/50 bg-card' id="address-section">
          <h2 className='text-lg font-semibold tracking-tight mb-4'>Service Location</h2>
          <AddressSelector
            selectedAddressId={selectedAddressId}
            onSelect={setSelectedAddressId}
          />
        </Card>
      </div>

      {/* ───────────── RIGHT ───────────── */}
      <div className="w-full">
        <Card className='p-6 rounded-3xl border-none shadow-lg shadow-black/5 ring-1 ring-border/50 bg-card sticky top-24 space-y-6'>
          <h2 className='text-xl font-bold tracking-tight'>Booking Summary</h2>

          {selectedAddressId && addressData?.data?.find(a => a.addressId === selectedAddressId) && (
            <div className="bg-muted/30 p-4 rounded-xl border border-border/50 space-y-2">
              <p className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <MapPin size={16} className="text-primary" /> Service Address
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {addressData.data.find(a => a.addressId === selectedAddressId)?.addressLine1},{' '}
                {addressData.data.find(a => a.addressId === selectedAddressId)?.city}
              </p>
            </div>
          )}

          {selectedSlot ? (
            <div className='relative bg-primary/5 border border-primary/20 p-4 rounded-xl flex justify-between items-start gap-4'>
              <div className="space-y-1">
                <p className='text-sm font-bold text-foreground'>
                  {selectedSlot.date}
                </p>
                <p className='text-xs font-medium text-muted-foreground'>
                  {selectedSlot.start} – {selectedSlot.end}
                </p>
                {selectedSlot.variant?.name && (
                  <p className='text-xs font-semibold text-primary mt-1'>
                    {selectedSlot.variant.name}
                  </p>
                )}
              </div>

              <div className='flex flex-col items-end gap-3'>
                <button
                  onClick={() => setSelectedSlotStart(null)}
                  className='p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors'
                  title='Remove slot'
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className='text-sm font-medium text-muted-foreground text-center py-6 border border-dashed border-border/60 rounded-xl bg-muted/10'>
              Please select a slot
            </div>
          )}

          <div className='space-y-3 pt-4 border-t border-border/50'>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Service Price</span>
              <span className='font-semibold text-foreground'>₹{totalPrice}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Advance Payment</span>
              <span className='font-semibold text-foreground'>₹{totalAdvance}</span>
            </div>
          </div>
          
          <div className='flex justify-between items-center py-4 border-y border-border/50'>
            <span className='font-bold text-foreground'>Total Payable Now</span>
            <span className='text-2xl font-black text-primary'>₹{totalAdvance}</span>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-semibold text-foreground'>Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as 'stripe')}
              className='w-full border-2 border-border/50 bg-background rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
            >
              <option value='stripe'>Stripe (Card / UPI)</option>
            </select>
          </div>

          <Button
            size="lg"
            className='w-full h-14 rounded-xl text-base font-bold shadow-md active:scale-95 transition-all'
            disabled={!selectedSlot}
            onClick={PayAdvanceButtonClick}
          >
            Pay Advance ₹{totalAdvance}
          </Button>
          <p className="text-xs text-center text-muted-foreground font-medium">
            Secure and encrypted payment
          </p>
        </Card>
      </div>
    </div>
  )
}
