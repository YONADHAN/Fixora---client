'use client'

import { useParams, useRouter } from 'next/navigation'
import { useGetServicesById } from '@/lib/hooks/useService'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Calendar, Clock, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  getAvailableBookingDates,
  groupDatesByMonth,
  generateTimeSlots,
} from '@/utils/helpers/booking/booking'

export default function BookServicePage() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params.id as string

  const { data, isLoading, isError } = useGetServicesById({ serviceId })

  const [datesByMonth, setDatesByMonth] = useState<Record<string, string[]>>({})
  const [monthKey, setMonthKey] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const [slots, setSlots] = useState<string[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  const [addedSlots, setAddedSlots] = useState<string[]>([])

  // Load dates
  useEffect(() => {
    if (!data) return
    const valid = getAvailableBookingDates(data.schedule)
    const grouped = groupDatesByMonth(valid)
    setDatesByMonth(grouped)

    const keys = Object.keys(grouped)
    if (keys.length > 0) {
      setMonthKey(keys[0])
      setSelectedDate(grouped[keys[0]][0])
    }
  }, [data])

  // Load slots
  useEffect(() => {
    if (!selectedDate || !data) return
    const generated = generateTimeSlots(selectedDate, data.schedule)
    setSlots(generated)
    setSelectedSlot(null)
  }, [selectedDate, data])

  if (isLoading) return <p className='p-6'>Loading…</p>
  if (isError || !data) return <p className='p-6'>Error loading service</p>

  const monthKeys = Object.keys(datesByMonth)

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })

  const addSlot = () => {
    if (!selectedSlot) return
    if (!addedSlots.includes(selectedSlot)) {
      setAddedSlots([...addedSlots, selectedSlot])
    }
  }

  const removeSlot = (slot: string) => {
    setAddedSlots(addedSlots.filter((s) => s !== slot))
  }

  const price = data.pricing.pricePerSlot
  const advance = data.pricing.advanceAmountPerSlot

  const totalPrice = addedSlots.length * price
  const totalAdvance = addedSlots.length * advance

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 p-6 max-w-6xl mx-auto'>
      {/* LEFT SECTION – Calendar + Time Slots */}
      <div className='md:col-span-2 space-y-6'>
        {/* ──────────────── COMPACT DATE SECTION ──────────────── */}
        <Card className='p-4 space-y-3'>
          <h2 className='text-lg font-semibold flex items-center gap-2'>
            <Calendar size={18} /> Select Date
          </h2>

          {/* Month navigation (small size) */}
          <div className='flex items-center justify-between text-sm'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => {
                const idx = monthKeys.indexOf(monthKey!)
                if (idx > 0) setMonthKey(monthKeys[idx - 1])
              }}
            >
              ‹
            </Button>

            <p className='font-medium'>{monthKey}</p>

            <Button
              size='sm'
              variant='outline'
              onClick={() => {
                const idx = monthKeys.indexOf(monthKey!)
                if (idx < monthKeys.length - 1) setMonthKey(monthKeys[idx + 1])
              }}
            >
              ›
            </Button>
          </div>

          {/* Compact Calendar */}
          <div className='grid grid-cols-4 sm:grid-cols-5 gap-2'>
            {monthKey &&
              datesByMonth[monthKey].map((d) => (
                <Button
                  key={d}
                  size='sm'
                  variant={selectedDate === d ? 'default' : 'outline'}
                  className='py-2 text-xs'
                  onClick={() => setSelectedDate(d)}
                >
                  {new Date(d).getDate()}
                </Button>
              ))}
          </div>
        </Card>

        {/* ──────────────── COMPACT TIME SLOT SECTION ──────────────── */}
        <Card className='p-4 space-y-3'>
          <h2 className='text-lg font-semibold flex items-center gap-2'>
            <Clock size={18} /> Select Time Slot
          </h2>

          <div className='grid grid-cols-3 md:grid-cols-4 gap-2'>
            {slots.map((slot) => (
              <Button
                key={slot}
                size='sm'
                variant={selectedSlot === slot ? 'default' : 'outline'}
                className='text-xs py-2'
                onClick={() => setSelectedSlot(slot)}
              >
                {formatTime(slot)}
              </Button>
            ))}
          </div>

          <Button
            size='sm'
            className='mt-2'
            disabled={!selectedSlot}
            onClick={addSlot}
          >
            <Plus size={14} className='mr-1' /> Add Slot
          </Button>
        </Card>
      </div>

      {/* RIGHT SECTION – Summary */}
      <div className='md:col-span-1'>
        <Card className='p-4 space-y-4 sticky top-6'>
          <h2 className='text-lg font-semibold'>Your Booking</h2>

          {/* Selected Slots List */}
          {addedSlots.length === 0 && (
            <p className='text-sm text-gray-500'>No time slots added yet.</p>
          )}

          <ul className='space-y-2'>
            {addedSlots.map((slot) => (
              <li
                key={slot}
                className='flex items-center justify-between bg-gray-100 p-2 rounded'
              >
                <span className='text-sm'>{formatTime(slot)}</span>
                <Button
                  size='icon'
                  variant='ghost'
                  onClick={() => removeSlot(slot)}
                >
                  <Trash2 size={16} className='text-red-500' />
                </Button>
              </li>
            ))}
          </ul>

          <hr />

          {/* Totals */}
          <p className='text-sm flex justify-between'>
            <span>Total Price:</span>
            <span className='font-semibold'>₹{totalPrice}</span>
          </p>

          <p className='text-sm flex justify-between'>
            <span>Total Advance:</span>
            <span className='font-semibold'>₹{totalAdvance}</span>
          </p>

          <Button
            disabled={addedSlots.length === 0}
            className='w-full text-md py-3'
            onClick={() =>
              router.push(
                `/customer/service/${serviceId}/confirm?date=${selectedDate}&slots=${encodeURIComponent(
                  JSON.stringify(addedSlots)
                )}`
              )
            }
          >
            Continue
          </Button>
        </Card>
      </div>
    </div>
  )
}
