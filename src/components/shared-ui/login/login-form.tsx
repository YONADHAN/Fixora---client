'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '@/lib/schemas/loginSchema'
import { EyeClosed, EyeIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import GoogleLoginButton from './google-login-button'
import { useState } from 'react'
interface LoginFormProps extends Omit<React.ComponentProps<'div'>, 'onSubmit'> {
  role: 'customer' | 'vendor' | 'admin'
  onSubmit: (data: LoginFormData) => Promise<void>
}

export function LoginForm({
  role,
  onSubmit,

  className,
  ...props
}: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })
  const [passwordView, setPasswordView] = useState(false)
  const handleFormSubmit = async (data: LoginFormData) => {
    await onSubmit(data)
  }

  return (
    <div className={cn('flex flex-col gap-8', className)} {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className='p-6 md:p-8'
          >
            <div className='flex flex-col gap-6'>
              {/* Header */}
              <div className='flex flex-col items-center text-center'>
                <h1 className='text-2xl font-bold'>Welcome back</h1>
                <p className='text-muted-foreground text-balance'>
                  Login to your Fixora account
                </p>
              </div>
              {/* Email */}
              <div className='grid gap-3'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  {...register('email')}
                />
                {errors.email && (
                  <p className='text-sm text-red-500'>{errors.email.message}</p>
                )}
              </div>
              {/* Password */}
              <div className='grid gap-3'>
                <div className='flex items-center '>
                  <Label htmlFor='password'>Password</Label>
                </div>
                <div className='relative'>
                  <Input
                    id='password'
                    type={passwordView ? 'text' : 'password'}
                    {...register('password')}
                    className='pr-10'
                  />

                  <button
                    type='button'
                    onClick={() => setPasswordView((prev) => !prev)}
                    className='absolute right-3 top-1/2 -translate-y-1/2'
                  >
                    {passwordView ? (
                      <span>
                        <EyeIcon size={16} />
                      </span>
                    ) : (
                      <span>
                        <EyeClosed size={16} />
                      </span>
                    )}
                  </button>
                </div>

                <Link
                  href={`/${role ? role : 'customer'}/forgot-password`}
                  className='ml-auto text-sm underline-offset-2 hover:underline'
                >
                  Forgot your password?
                </Link>
                {errors.password && (
                  <p className='text-sm text-red-500'>
                    {errors.password.message}
                  </p>
                )}
              </div>
              {/* Login Button */}
              <Button type='submit' className='w-full'>
                Login
              </Button>
              {/* Divider */}
              <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                <span className='bg-card text-muted-foreground relative z-10 px-2'>
                  Or continue with
                </span>
              </div>

              <GoogleLoginButton role={role} />
              {/* Footer link */}
              {role !== 'admin' && (
                <div className='text-center text-sm'>
                  Don&apos;t have an account?{' '}
                  <Link
                    href={`/${role}/signup`}
                    className='underline underline-offset-4'
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </form>

          {/* Image Side */}
          <div className='bg-muted relative hidden md:block'>
            <Image src={'/admin/login.jpg'} fill alt='signin' />
          </div>
        </CardContent>
      </Card>

      {/* Terms */}
      <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
        By clicking continue, you agree to our <a href='#'>Terms of Service</a>{' '}
        and <a href='#'>Privacy Policy</a>.
      </div>
    </div>
  )
}
