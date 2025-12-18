'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Clock, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

import {
  useCreateBookingHold,
  useGetAvailableSlotsForCustomer,
} from '@/lib/hooks/useBooking'
import { useGetServicesById } from '@/lib/hooks/useService'

import { toast } from 'sonner'
import SignInModal from './signIn_modal'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'

/* ───────────────── TYPES ───────────────── */

type Slot = {
  start: string
  end: string
}

type SelectedSlot = {
  date: string
  start: string
  end: string

  pricing: {
    pricePerSlot: number
    advancePerSlot: number
  }

  variant?: {
    name?: string
    price?: number
  }
}

/* ───────────────── COMPONENT ───────────────── */

export default function BookServicePage() {
  const params = useParams()
  const serviceId = params.id as string
  const router = useRouter()

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
  const [addedSlots, setAddedSlots] = useState<SelectedSlot[]>([])

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
  const { mutate: createHold, isPending, isSuccess } = useCreateBookingHold()
  /* ───────────── Derived Data ───────────── */

  const customer = useSelector((state: RootState) => state.customer.customer)
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

  const totalPrice = addedSlots.reduce(
    (sum, s) => sum + s.pricing.pricePerSlot,
    0
  )

  const totalAdvance = addedSlots.reduce(
    (sum, s) => sum + s.pricing.advancePerSlot,
    0
  )

  /* ───────────── Effects ───────────── */

  useEffect(() => {
    if (availableDates.length > 0) setSelectedDate(availableDates[0])
    else setSelectedDate(null)
  }, [year, month, availableDates.length])

  const slotsForSelectedDate: Slot[] =
    selectedDate && slotsByDate[selectedDate] ? slotsByDate[selectedDate] : []

  const hasSlotOnDate = (date: string) =>
    addedSlots.some((s) => s.date === date)

  const isSlotSelected = (date: string, start: string) =>
    addedSlots.some((s) => s.date === date && s.start === start)

  /* ───────────── Slot Actions ───────────── */
  const bookingHoldPayload = {
    serviceId,
    paymentMethod,

    slots: addedSlots.map((s) => ({
      date: s.date,
      start: s.start,
      end: s.end,

      pricePerSlot: s.pricing.pricePerSlot,
      advancePerSlot: s.pricing.advancePerSlot,

      variant: s.variant,
    })),

    pricing: {
      totalAmount: totalPrice,
      advanceAmount: totalAdvance,
      remainingAmount: totalPrice - totalAdvance,
    },
  }

  const addSlot = () => {
    if (!selectedDate || !selectedSlotStart) return

    if (hasVariants && selectedVariantIndex === undefined) {
      toast.error('Please select a variant or choose No Variant')
      return
    }

    const slot = slotsForSelectedDate.find((s) => s.start === selectedSlotStart)
    if (!slot) return

    const exists = addedSlots.some(
      (s) => s.date === selectedDate && s.start === slot.start
    )
    if (exists) return

    setAddedSlots((prev) => [
      ...prev,
      {
        date: selectedDate,
        start: slot.start,
        end: slot.end,

        pricing: {
          pricePerSlot: effectivePricePerSlot,
          advancePerSlot: effectiveAdvancePerSlot,
        },

        variant: selectedVariant
          ? {
              name: selectedVariant.name,
              price: selectedVariant.price,
            }
          : undefined,
      },
    ])
  }

  const removeSlot = (date: string, start: string) => {
    setAddedSlots((prev) =>
      prev.filter((s) => !(s.date === date && s.start === start))
    )
  }

  /* ───────────── Month Navigation ───────────── */

  const goPrevMonth = () => {
    setSelectedDate(null)
    setAddedSlots([])
    setSelectedSlotStart(null)

    month === 0 ? (setMonth(11), setYear((y) => y - 1)) : setMonth((m) => m - 1)
  }

  const goNextMonth = () => {
    setSelectedDate(null)
    setAddedSlots([])
    setSelectedSlotStart(null)

    month === 11 ? (setMonth(0), setYear((y) => y + 1)) : setMonth((m) => m + 1)
  }

  /* ───────────── Payment ───────────── */

  const PayAdvanceButtonClick = () => {
    if (addedSlots.length === 0) {
      toast.error('Please select at least one slot')
      return
    }

    if (!customer) {
      setPendingPayment(true)
      setShowLoginModal(true)
      return
    }

    createHold(
      {
        serviceId,
        paymentMethod,
        slots: addedSlots,
      },
      {
        onSuccess: (data) => {
          console.log('Booking hold created:', data)

          // router.push(`/customer/payment/${data.holdId}`)
        },
        onError: (error) => {
          console.error(error)
          toast.error('Failed to create booking hold')
        },
      }
    )
  }

  /* ───────────── Guards ───────────── */

  if (isLoading || isServiceLoading) return <p className='p-6'>Loading…</p>
  if (isError || isServiceError || !service)
    return <p className='p-6'>Error loading data</p>

  /* ───────────────── UI ───────────────── */

  return (
    <div className='max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6'>
      <SignInModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setShowLoginModal(false)
          setPendingPayment(false)
          router.push(`/customer/service/${serviceId}/confirm`)
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
            {availableDates.map((d) => (
              <Button
                key={d}
                size='sm'
                variant={
                  selectedDate === d
                    ? 'default'
                    : hasSlotOnDate(d)
                    ? 'secondary'
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
          <h2 className='text-sm font-semibold flex gap-2 mb-2'>
            <Clock size={14} /> Select Time Slot
          </h2>

          <div className='grid grid-cols-3 md:grid-cols-4 gap-1.5 mb-2'>
            {slotsForSelectedDate.map((slot) => (
              <Button
                key={slot.start}
                size='sm'
                variant={
                  isSlotSelected(selectedDate!, slot.start)
                    ? 'secondary'
                    : selectedSlotStart === slot.start
                    ? 'default'
                    : 'outline'
                }
                onClick={() => setSelectedSlotStart(slot.start)}
              >
                {slot.start}–{slot.end}
              </Button>
            ))}
          </div>

          <Button size='sm' disabled={!selectedSlotStart} onClick={addSlot}>
            <Plus size={12} className='mr-1' /> Add Slot
          </Button>
        </Card>

        {/* Variant (OPTIONAL) */}
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
      </div>

      {/* ───────────── RIGHT ───────────── */}
      <Card className='p-4 h-fit sticky top-4 space-y-4'>
        <h2 className='text-base font-semibold'>Booking Summary</h2>

        {addedSlots.map((s) => (
          <div
            key={`${s.date}-${s.start}`}
            className='text-xs flex justify-between items-start gap-2'
          >
            <div>
              <div>
                {s.date} • {s.start}–{s.end}
              </div>
              {s.variant?.name && (
                <div className='text-[10px] text-muted-foreground'>
                  {s.variant.name}
                </div>
              )}
            </div>

            <div className='flex items-center gap-2 text-right text-[10px]'>
              <div className='text-muted-foreground leading-tight'>
                <div>₹{s.pricing.pricePerSlot}</div>
                <div>Adv ₹{s.pricing.advancePerSlot}</div>
              </div>

              <button
                onClick={() => removeSlot(s.date, s.start)}
                className='text-red-500 hover:text-red-600'
                title='Remove slot'
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}

        <div className='text-xs space-y-1'>
          <div className='flex justify-between'>
            <span>Price / Slot</span>
            <span>₹{effectivePricePerSlot}</span>
          </div>
          <div className='flex justify-between'>
            <span>Advance / Slot</span>
            <span>₹{effectiveAdvancePerSlot}</span>
          </div>
          <div className='flex justify-between font-medium'>
            <span>Total</span>
            <span>₹{totalPrice}</span>
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
          disabled={addedSlots.length === 0}
          onClick={PayAdvanceButtonClick}
        >
          <span>Pay Advance</span>
          <span>₹{totalAdvance}</span>
        </Button>
      </Card>
    </div>
  )
}
