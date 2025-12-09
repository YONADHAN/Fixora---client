'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import { useGetServicesById } from '@/lib/hooks/useService'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getAvailableDates } from '@/utils/helpers/getAvailableDates'
import { generateSlotsForDate } from '@/utils/helpers/slotGenerator'
import { Clock, Calendar, Star, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ServiceDetailPage() {
  const params = useParams()
  const serviceId = params.id as string

  const { data, isLoading } = useGetServicesById({ serviceId })

  const [datesByMonth, setDatesByMonth] = useState<Record<string, string[]>>({})
  const [monthKey, setMonthKey] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const [slots, setSlots] = useState<Date[]>([])
  const [selectedSlots, setSelectedSlots] = useState<Date[]>([])

  // Load data
  useEffect(() => {
    if (!data) return

    const map = getAvailableDates(data.schedule)
    setDatesByMonth(map)

    const monthKeys = Object.keys(map).sort()
    if (monthKeys.length > 0) {
      setMonthKey(monthKeys[0])
      setSelectedDate(map[monthKeys[0]][0])
    }
  }, [data])

  // Generate slots
  useEffect(() => {
    if (!selectedDate || !data) return

    const generated = generateSlotsForDate(
      new Date(selectedDate),
      data.schedule
    )
    setSlots(generated)
    setSelectedSlots([])
  }, [selectedDate, data])

  if (isLoading) return <p className='p-6'>Loading…</p>
  if (!data) return <p className='p-6'>Service not found.</p>

  const price = data.pricing.pricePerSlot
  const advance = data.pricing.advanceAmountPerSlot

  // Selected totals
  const totalPrice = selectedSlots.length * price
  const totalAdvance = selectedSlots.length * advance

  // Month formatting
  const formatMonth = (key: string) => {
    const [year, month] = key.split('-')
    return new Date(Number(year), Number(month) - 1).toLocaleDateString(
      'en-US',
      {
        month: 'long',
        year: 'numeric',
      }
    )
  }

  const monthKeys = Object.keys(datesByMonth).sort()

  const handlePrevMonth = () => {
    const index = monthKeys.indexOf(monthKey!)
    if (index > 0) {
      const newKey = monthKeys[index - 1]
      setMonthKey(newKey)
      setSelectedDate(datesByMonth[newKey][0])
    }
  }

  const handleNextMonth = () => {
    const index = monthKeys.indexOf(monthKey!)
    if (index < monthKeys.length - 1) {
      const newKey = monthKeys[index + 1]
      setMonthKey(newKey)
      setSelectedDate(datesByMonth[newKey][0])
    }
  }

  const toggleSlot = (slot: Date) => {
    setSelectedSlots((prev) => {
      const exists = prev.some((s) => s.getTime() === slot.getTime())
      if (exists) {
        return prev.filter((s) => s.getTime() !== slot.getTime())
      }
      return [...prev, slot]
    })
  }

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className='max-w-5xl mx-auto p-6 space-y-10'>
      {/* Header */}
      <div className='grid md:grid-cols-2 gap-6'>
        <img
          src={data.images[0]}
          className='rounded-xl h-80 w-full object-cover'
        />

        <div className='space-y-4'>
          <h1 className='text-3xl font-bold'>{data.title}</h1>

          <div className='flex items-center gap-2 text-yellow-500'>
            <Star size={18} />
            <span className='text-sm text-gray-600'>4.8 (42 reviews)</span>
          </div>

          <p className='text-gray-600'>{data.description}</p>

          <p className='text-3xl font-semibold'>₹ {price}</p>
        </div>
      </div>

      {/* Date selector */}
      <Card className='p-6 space-y-4'>
        <div className='flex justify-between items-center'>
          <Button
            variant='ghost'
            onClick={handlePrevMonth}
            disabled={monthKeys.indexOf(monthKey!) === 0}
          >
            <ChevronLeft />
          </Button>

          <h2 className='text-xl font-semibold flex items-center gap-2'>
            <Calendar size={20} /> {monthKey && formatMonth(monthKey)}
          </h2>

          <Button
            variant='ghost'
            onClick={handleNextMonth}
            disabled={monthKeys.indexOf(monthKey!) === monthKeys.length - 1}
          >
            <ChevronRight />
          </Button>
        </div>

        <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3'>
          {monthKey &&
            datesByMonth[monthKey].map((d) => {
              const dateObj = new Date(d)
              const isSelected = selectedDate === d

              return (
                <Button
                  key={d}
                  variant={isSelected ? 'default' : 'outline'}
                  className='
    flex flex-col items-center justify-center
    py-2 px-2
    min-h-[60px]
    rounded-lg border
    transition-all
  '
                  onClick={() => setSelectedDate(d)}
                >
                  <span className='text-base font-semibold'>
                    {dateObj.getDate()}
                  </span>
                  <span className='text-[10px] text-gray-700'>
                    {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                </Button>
              )
            })}
        </div>
      </Card>

      {/* Time Slots */}
      <Card className='p-6 space-y-4'>
        <h2 className='text-xl font-semibold flex items-center gap-2'>
          <Clock size={20} /> Select Time Slots
        </h2>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
          {slots.map((slot) => {
            const isActive = selectedSlots.some(
              (s) => s.getTime() === slot.getTime()
            )
            return (
              <Button
                key={slot.toISOString()}
                variant={isActive ? 'default' : 'outline'}
                className='rounded-full'
                onClick={() => toggleSlot(slot)}
              >
                {formatTime(slot)}
              </Button>
            )
          })}
        </div>
      </Card>

      {/* Summary */}
      {selectedSlots.length > 0 && (
        <Card className='p-6 bg-primary/5 border border-primary/40'>
          <p className='text-lg font-semibold'>Booking Summary</p>
          <p className='text-gray-700 mt-2'>
            Slots selected: {selectedSlots.length}
          </p>
          <p className='text-gray-800 mt-1 font-medium'>
            Total Price: ₹ {totalPrice}
          </p>
          <p className='text-gray-800 mt-1 font-medium'>
            Total Advance: ₹ {totalAdvance}
          </p>
        </Card>
      )}

      {/* Final Button */}
      <Button
        size='lg'
        className='w-full md:w-auto px-10 text-lg'
        disabled={selectedSlots.length === 0}
      >
        {selectedSlots.length > 0
          ? 'Proceed to Booking'
          : 'Select Slots to Continue'}
      </Button>
    </div>
  )
}
