'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Clock, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

import { useGetAvailableSlotsForCustomer } from '@/lib/hooks/useBooking'

/* ───────────────── TYPES ───────────────── */

type Slot = {
  start: string
  end: string
}

type SelectedSlot = {
  date: string
  start: string
  end: string
}

/* ───────────────── COMPONENT ───────────────── */

export default function BookServicePage() {
  const params = useParams()
  const serviceId = params.id as string

  /* ───────────── Calendar State (API-driven) ───────────── */

  const today = new Date()
  const [year, setYear] = useState<number>(today.getFullYear())
  const [month, setMonth] = useState<number>(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  /* ───────────── Slot State ───────────── */

  const [selectedSlotStart, setSelectedSlotStart] = useState<string | null>(
    null
  )
  const [addedSlots, setAddedSlots] = useState<SelectedSlot[]>([])

  /* ───────────── Payment State ───────────── */

  const [paymentMethod, setPaymentMethod] = useState<'stripe'>('stripe')

  /* ───────────── Fetch Available Slots (SOURCE OF TRUTH) ───────────── */

  const {
    data: slotsByDate = {},
    isLoading,
    isError,
  } = useGetAvailableSlotsForCustomer({
    serviceId,
    year: year.toString(),
    month: month.toString(),
  })

  /* ───────────── Derived Data ───────────── */

  const availableDates = Object.keys(slotsByDate)

  useEffect(() => {
    if (availableDates.length > 0) {
      setSelectedDate(availableDates[0])
    } else {
      setSelectedDate(null)
    }
  }, [year, month, availableDates.length])

  const slotsForSelectedDate: Slot[] =
    selectedDate && slotsByDate[selectedDate] ? slotsByDate[selectedDate] : []

  const hasSlotOnDate = (date: string) =>
    addedSlots.some((s) => s.date === date)

  const isSlotSelected = (date: string, start: string) =>
    addedSlots.some((s) => s.date === date && s.start === start)

  /* ───────────── Add / Remove Slot ───────────── */

  const addSlot = () => {
    if (!selectedDate || !selectedSlotStart) return

    const slot = slotsForSelectedDate.find((s) => s.start === selectedSlotStart)
    if (!slot) return

    const exists = addedSlots.some(
      (s) => s.date === selectedDate && s.start === slot.start
    )
    if (exists) return

    setAddedSlots((prev) => [
      ...prev,
      { date: selectedDate, start: slot.start, end: slot.end },
    ])
  }

  const removeSlot = (date: string, start: string) => {
    setAddedSlots((prev) =>
      prev.filter((s) => !(s.date === date && s.start === start))
    )
  }

  /* ───────────── Pricing (example values) ───────────── */
  // These should come from backend later via /holds response

  const PRICE_PER_SLOT = 500
  const ADVANCE_PER_SLOT = 100

  const totalPrice = addedSlots.length * PRICE_PER_SLOT
  const totalAdvance = addedSlots.length * ADVANCE_PER_SLOT

  /* ───────────── Month Navigation ───────────── */

  const goPrevMonth = () => {
    setSelectedDate(null)
    setAddedSlots([])
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
    setAddedSlots([])
    setSelectedSlotStart(null)

    if (month === 11) {
      setMonth(0)
      setYear((y) => y + 1)
    } else {
      setMonth((m) => m + 1)
    }
  }

  /* ───────────── Guards ───────────── */

  if (isLoading) return <p className='p-6'>Loading slots…</p>
  if (isError) return <p className='p-6'>Error loading slots</p>

  /* ───────────────── UI ───────────────── */

  return (
    <div className='max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6'>
      {/* ───────────── LEFT ───────────── */}
      <div className='space-y-4'>
        {/* Calendar */}
        <Card className='p-3'>
          <div className='flex items-center justify-between mb-2'>
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
                className='h-7 text-xs'
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
                className='h-7 text-xs'
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

          <Button
            size='sm'
            className='h-7 text-xs'
            disabled={!selectedSlotStart}
            onClick={addSlot}
          >
            <Plus size={12} className='mr-1' /> Add Slot
          </Button>
        </Card>
      </div>

      {/* ───────────── RIGHT ───────────── */}
      <Card className='p-4 h-fit sticky top-4 space-y-4'>
        <h2 className='text-base font-semibold'>Booking Summary</h2>

        {addedSlots.length === 0 ? (
          <p className='text-xs text-muted-foreground'>No slots added</p>
        ) : (
          <ul className='space-y-2'>
            {addedSlots.map((s) => (
              <li
                key={`${s.date}-${s.start}`}
                className='flex justify-between items-center text-xs bg-muted/50 px-2 py-1.5 rounded'
              >
                <span>
                  {s.date} • {s.start}–{s.end}
                </span>
                <Button
                  size='icon'
                  variant='ghost'
                  onClick={() => removeSlot(s.date, s.start)}
                >
                  <Trash2 size={12} />
                </Button>
              </li>
            ))}
          </ul>
        )}

        {/* Payment Method */}
        <div>
          <label className='text-xs font-medium mb-1 block'>
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as 'stripe')}
            className='w-full text-xs px-2 py-1.5 border rounded'
          >
            <option value='stripe'>Stripe</option>
          </select>
        </div>

        {/* Pay Button */}
        <Button
          className='w-full justify-between'
          disabled={addedSlots.length === 0}
        >
          <span>Pay Advance</span>
          <span>₹{totalAdvance}</span>
        </Button>
      </Card>
    </div>
  )
}
