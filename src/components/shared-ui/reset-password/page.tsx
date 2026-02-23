'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useFormik } from 'formik'
import { resetPasswordSchema } from '@/schemas/feature/reset-password-schema'
import { EyeIcon, EyeClosed } from 'lucide-react'

type ResetPasswordProps = {
  handleSubmit: (data: {
    newPassword: string
    confirmPassword: string
  }) => Promise<void>
  role: 'admin' | 'customer' | 'vendor'
}

export default function ResetPassword({
  handleSubmit,
  role,
}: ResetPasswordProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: resetPasswordSchema,
    onSubmit: () => {},
  })

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    formik.setTouched({ newPassword: true, confirmPassword: true })
    const errors = await formik.validateForm()

    if (Object.keys(errors).length === 0) {
      await handleSubmit({
        newPassword: formik.values.newPassword,
        confirmPassword: formik.values.confirmPassword,
      })
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4'>
      <div className='bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-800'>
        <h2 className='text-center text-2xl font-semibold text-gray-900 dark:text-gray-100'>
          Reset Password
        </h2>
        <p className='mt-2 text-center text-sm text-gray-600 dark:text-gray-400'>
          Create a new secure password to continue.
        </p>

        <form className='mt-8 space-y-5' onSubmit={handleFormSubmit}>
          {/* New Password */}
          <div className='relative'>
            <Label htmlFor='newPassword'>New Password</Label>
            <Input
              id='newPassword'
              name='newPassword'
              type={showPassword ? 'text' : 'password'}
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className='pr-10'
            />

            <button
              type='button'
              className='absolute right-3 top-[20px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer'
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault()
                e.stopPropagation()
                setShowPassword((prev) => !prev)
              }}
              onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault()
              }}
            >
              {showPassword ? <EyeClosed size={18} /> : <EyeIcon size={18} />}
            </button>

            {formik.touched.newPassword && formik.errors.newPassword && (
              <p className='text-sm text-red-500 mt-1'>
                {formik.errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className='relative'>
            <Label htmlFor='confirmPassword'>Confirm Password</Label>
            <Input
              id='confirmPassword'
              name='confirmPassword'
              type={showConfirmPassword ? 'text' : 'password'}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className='pr-10'
            />

            <button
              type='button'
              className='absolute right-3 top-[20px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer'
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault()
                e.stopPropagation()
                setShowConfirmPassword((prev) => !prev)
              }}
              onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault()
              }}
            >
              {showConfirmPassword ? (
                <EyeClosed size={18} />
              ) : (
                <EyeIcon size={18} />
              )}
            </button>

            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className='text-sm text-red-500 mt-1'>
                  {formik.errors.confirmPassword}
                </p>
              )}
          </div>

          <Button type='submit' className='w-full mt-4'>
            Reset Password
          </Button>
        </form>

        <Link
          href={`/${role}/signin`}
          className='block text-center mt-6 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  )
}
