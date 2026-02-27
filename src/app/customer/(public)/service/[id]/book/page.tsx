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
  const [pendingPayment, setPendingPayment] = useState(false)

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

  const { mutate: createHold, isPending, isSuccess } = useCreateBookingHold()
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

    month === 0 ? (setMonth(11), setYear((y) => y - 1)) : setMonth((m) => m - 1)
  }

  const goNextMonth = () => {
    setSelectedDate(null)
    setSelectedSlotStart(null)

    month === 11 ? (setMonth(0), setYear((y) => y + 1)) : setMonth((m) => m + 1)
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
      setPendingPayment(true)
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
    <div className='max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6'>
      <SignInModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setShowLoginModal(false)
          setPendingPayment(false)
          // Stay on this page so user can continue booking
        }}
      />

      {/* ───────────── LEFT ───────────── */}
      <div className='space-y-4'>
        {/* Calendar */}
        <Card className='p-3'>
          <div className='flex justify-between mb-2'>
            <Button size='sm' variant='outline' onClick={goPrevMonth}>
              ‹
            </Button>
            <h2 className='text-sm font-semibold'>
              {new Date(year, month).toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </h2>
            <Button size='sm' variant='outline' onClick={goNextMonth}>
              ›
            </Button>
          </div>

          <div className='grid grid-cols-7 gap-1.5'>
            {availableDates.filter((d) => !isDateInPast(d)).map((d) => (
              <Button
                key={d}
                size='sm'
                variant={
                  selectedDate === d
                    ? 'default'
                    : 'outline'
                }
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
        <Card className='p-3'>
          <div className='flex items-center justify-between mb-2'>
            <h2 className='text-sm font-semibold flex gap-2'>
              <Clock size={14} /> Select Time Slot
            </h2>
            {selectedSlot && (
              <span className='text-xs text-muted-foreground'>
                Selected: {selectedSlot.start} - {selectedSlot.end}
              </span>
            )}
          </div>

          <div className='grid grid-cols-3 md:grid-cols-4 gap-1.5 mb-2'>
            {slotsForSelectedDate.map((slot) => {
              const slotDate = selectedDate ? new Date(selectedDate) : null

              const disabled =
                !slotDate || isSlotInPast(slotDate, slot.start)

              return (
                <Button
                  key={slot.start}
                  size='sm'
                  disabled={disabled}
                  variant={
                    selectedSlotStart === slot.start
                      ? 'default'
                      : 'outline'
                  }
                  onClick={() => !disabled && handleSlotClick(slot.start)}
                >
                  {slot.start}–{slot.end}
                </Button>
              )
            })}
            {/* {slotsForSelectedDate.map((slot) => (
              <Button
                key={slot.start}
                size='sm'
                variant={
                  selectedSlotStart === slot.start
                    ? 'default'
                    : 'outline'
                }
                onClick={() => handleSlotClick(slot.start)}
              >
                {slot.start}–{slot.end}
              </Button>
            ))} */}
          </div>
          {slotsForSelectedDate.length === 0 && (
            <p className='text-xs text-muted-foreground p-2 text-center'>No slots available for this date.</p>
          )}
        </Card>

        {/* Variant  */}
        {hasVariants && (
          <Card className='p-3'>
            <h2 className='text-sm font-semibold mb-2'>
              Select Service Variant (Optional)
            </h2>

            <div className='space-y-2'>
              <Button
                variant={selectedVariantIndex === null ? 'default' : 'outline'}
                className='w-full justify-between'
                onClick={() => setSelectedVariantIndex(null)}
              >
                <span>No Variant</span>
                <span className='text-xs text-muted-foreground'>
                  ₹{basePrice}
                </span>
              </Button>
              {/* Variant options */}
              {service.serviceVariants!.map((variant, idx) => (
                <Button
                  key={idx}
                  variant={selectedVariantIndex === idx ? 'default' : 'outline'}
                  className='w-full justify-between'
                  onClick={() => setSelectedVariantIndex(idx)}
                >
                  <span>{variant.name}</span>
                  {variant.price && <span>₹{variant.price}</span>}
                </Button>
              ))}
            </div>
          </Card>
        )}

        {/* Address Selection */}
        <Card className='p-3' id="address-section">
          <h2 className='text-sm font-semibold mb-2'>Select Address</h2>
          <AddressSelector
            selectedAddressId={selectedAddressId}
            onSelect={setSelectedAddressId}
          />
        </Card>
      </div>

      {/* ───────────── RIGHT ───────────── */}
      <Card className='p-4 h-fit sticky top-4 space-y-4'>
        <h2 className='text-base font-semibold'>Booking Summary</h2>

        {selectedAddressId && addressData?.data?.find(a => a.addressId === selectedAddressId) && (
          <div className="bg-muted/50 p-2 rounded text-xs space-y-1 border">
            <p className="font-semibold flex items-center gap-1"><MapPin className="h-3 w-3" /> Service Address:</p>
            <p className="text-muted-foreground line-clamp-2">
              {addressData.data.find(a => a.addressId === selectedAddressId)?.addressLine1}, {addressData.data.find(a => a.addressId === selectedAddressId)?.city}
            </p>
          </div>
        )}

        {selectedSlot ? (
          <div
            className='text-xs flex justify-between items-start gap-2 bg-accent/20 p-2 rounded'
          >
            <div>
              <div className='font-medium'>
                {selectedSlot.date} • {selectedSlot.start}–{selectedSlot.end}
              </div>
              {selectedSlot.variant?.name && (
                <div className='text-[10px] text-muted-foreground'>
                  {selectedSlot.variant.name}
                </div>
              )}
            </div>

            <div className='flex items-center gap-2 text-right text-[10px]'>
              <div className='text-muted-foreground leading-tight'>
                <div>₹{totalPrice}</div>
                <div>Adv ₹{totalAdvance}</div>
              </div>

              <button
                onClick={() => setSelectedSlotStart(null)}
                className='text-red-500 hover:text-red-600'
                title='Remove slot'
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ) : (
          <p className='text-xs text-muted-foreground text-center py-4 border border-dashed rounded'>
            Select a slot to continue
          </p>
        )}

        <div className='text-xs space-y-1 border-t pt-2'>
          <div className='flex justify-between'>
            <span>Price</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className='flex justify-between'>
            <span>Advance</span>
            <span>₹{totalAdvance}</span>
          </div>
          <div className='flex justify-between font-medium text-sm pt-1'>
            <span>Total Payable</span>
            <span>₹{totalAdvance}</span>
          </div>
        </div>
        <div className='space-y-1 text-xs'>
          <label className='font-medium'>Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as 'stripe')}
            className='w-full border rounded-md px-2 py-1 text-sm'
          >
            <option value='stripe'>Stripe (Card / UPI)</option>
          </select>
        </div>

        <Button
          className='w-full justify-between'
          disabled={!selectedSlot}
          onClick={PayAdvanceButtonClick}
        >
          <span>Pay Advance</span>
          <span>₹{totalAdvance}</span>
        </Button>
      </Card>
    </div >
  )
}
