'use client'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EyeClosed, EyeIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

const MapSelector = dynamic(() => import('@/utils/helpers/MapSelector'), {
  ssr: false,
})

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import GoogleLoginButton from '../login/google-login-button'

// Location schema
const locationSchema = z.object({
  name: z.string().min(1, 'Location name is required'),
  displayName: z.string().min(1, 'Display name is required'),
  zipCode: z.string().min(5, 'Zip code must be at least 5 characters'),
  lat: z.number(),
  lng: z.number(),
})

// Register form schema
export const registerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  location: locationSchema,
  zipcode: z.string().min(5, 'Zip code must be at least 5 characters'),
})

export type RegisterFormData = z.infer<typeof registerSchema>

interface RegisterFormProps
  extends Omit<React.ComponentProps<'div'>, 'onSubmit'> {
  role?: 'customer' | 'vendor'
  onSubmit: (data: RegisterFormData) => Promise<void>
  defaultLocation?: {
    lat: number
    lng: number
    name: string
    displayName: string
    zipCode: string
  }
}

export function RegisterForm({
  role = 'customer',
  onSubmit,
  defaultLocation,
  className,
  ...props
}: RegisterFormProps) {
  const [selectedLocation, setSelectedLocation] = useState(
    defaultLocation || null
  )
  const [mounted, setMounted] = useState(false)
  const [passwordEyeOpen, setPasswordEyeOpen] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      location: defaultLocation,
      zipcode: defaultLocation?.zipCode || '',
    },
  })

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (selectedLocation) {
      setValue('location', selectedLocation, { shouldValidate: true })
      setValue('zipcode', selectedLocation.zipCode, { shouldValidate: true })
    }
  }, [selectedLocation, setValue])

  const handleFormSubmit = async (data: RegisterFormData) => {
    await onSubmit(data)
  }

  const handleLocationSelect = (
    lat: number,
    lng: number,
    name?: string,
    displayName?: string
  ) => {
    const zipcode = watch('zipcode') || ''
    setSelectedLocation({
      lat,
      lng,
      name: name || 'Selected Location',
      displayName: displayName || `${lat}, ${lng}`,
      zipCode: zipcode,
    })
  }

  return (
    <div className={cn('flex flex-col gap-4', className)} {...props}>
      <Card className='overflow-hidden p-0 shadow-sm'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          {/* LEFT SIDE FORM — COMPRESSED */}
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className='p-4 md:p-6 space-y-4'
          >
            <div className='flex flex-col items-center text-center space-y-1'>
              <h1 className='text-xl font-semibold'>Create an Account</h1>
              <p className='text-sm text-muted-foreground'>
                Join Fixora in a few quick steps
              </p>
            </div>

            {/* Username + Email */}
            <div className='grid gap-3 md:grid-cols-2'>
              <div className='grid gap-1.5'>
                <Label htmlFor='username'>Username</Label>
                <Input id='username' {...register('name')} className='h-9' />
                {errors.name && (
                  <p className='text-xs text-red-500'>{errors.name.message}</p>
                )}
              </div>
              <div className='grid gap-1.5'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  {...register('email')}
                  className='h-9'
                />
                {errors.email && (
                  <p className='text-xs text-red-500'>{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Password + Phone */}
            <div className='grid gap-3 md:grid-cols-2'>
              <div className='grid gap-1.5'>
                <Label htmlFor='password'>Password</Label>
                <div className='relative'>
                  <Input
                    id='password'
                    type={passwordEyeOpen ? 'text' : 'password'}
                    {...register('password')}
                    className='h-9 pr-8'
                  />
                  <button
                    type='button'
                    className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground'
                    onClick={() => setPasswordEyeOpen((prev) => !prev)}
                  >
                    {passwordEyeOpen ? (
                      <EyeClosed size={16} />
                    ) : (
                      <EyeIcon size={16} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className='text-xs text-red-500'>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className='grid gap-1.5'>
                <Label htmlFor='phone'>Phone</Label>
                <Input
                  id='phone'
                  type='tel'
                  className='h-9'
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className='text-xs text-red-500'>{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Zip Code */}
            <div className='grid gap-1.5'>
              <Label htmlFor='zipcode'>Zip Code</Label>
              <Input
                id='zipcode'
                className='h-9'
                {...register('zipcode')}
                onChange={(e) => {
                  register('zipcode').onChange(e)
                  if (selectedLocation) {
                    setSelectedLocation({
                      ...selectedLocation,
                      zipCode: e.target.value,
                    })
                  }
                }}
              />
              {errors.zipcode && (
                <p className='text-xs text-red-500'>{errors.zipcode.message}</p>
              )}
            </div>

            {/* Location Selector */}
            <div className='grid gap-1.5'>
              <Label>Location</Label>
              <Dialog>
                <DialogTrigger asChild>
                  <Input
                    readOnly
                    className='cursor-pointer h-9'
                    value={selectedLocation?.displayName || ''}
                    placeholder='Select location on map'
                  />
                </DialogTrigger>
                <DialogContent className='sm:max-w-[500px]'>
                  <DialogHeader>
                    <DialogTitle>Select Location</DialogTitle>
                  </DialogHeader>
                  {mounted && (
                    <div className='h-80 w-full'>
                      <MapSelector onLocationSelect={handleLocationSelect} />
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              {errors.location && (
                <p className='text-xs text-red-500'>
                  {errors.location.message}
                </p>
              )}
            </div>

            <Button
              type='submit'
              className='w-full h-9 text-sm'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>

            <div className='relative text-center text-xs text-muted-foreground'>
              <span className='px-2 bg-card'>Or continue with</span>
              <div className='absolute inset-0 top-1/2 border-t border-border'></div>
            </div>

            <GoogleLoginButton role={role} />

            <div className='text-center text-xs'>
              Already have an account?{' '}
              <Link href={`/${role}/signin`} className='underline'>
                Sign in
              </Link>
            </div>
          </form>

          {/* RIGHT SIDE IMAGE */}
          <div className='bg-muted hidden md:block relative'>
            <Image
              src='/admin/login.jpg'
              alt='Registration'
              fill
              className='object-cover rounded-lg'
            />
          </div>
        </CardContent>
      </Card>

      {/* Terms */}
      <div className='text-center text-[10px] text-muted-foreground'>
        By continuing, you agree to our{' '}
        <a href='#' className='underline'>
          Terms of Service
        </a>{' '}
        and{' '}
        <a href='#' className='underline'>
          Privacy Policy
        </a>
        .
      </div>
    </div>
  )
}
