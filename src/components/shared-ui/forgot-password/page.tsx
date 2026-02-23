'use client'

import { Label } from '@/components/ui/label'
import { useFormik } from 'formik'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { emailSchema } from '@/schemas/common/email-schema'

type ForgotPasswordProps = {
  handleSubmit: (email: string) => void | Promise<void>
  role: string
}

export default function ForgotPassword({
  handleSubmit,
  role,
}: ForgotPasswordProps) {
  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: emailSchema,
    onSubmit: async ({ email }) => {
      await handleSubmit(email)
    },
  })

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 dark:bg-gray-950'>
      <div className='mx-auto w-full max-w-md space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50'>
            Forgot your password?
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600 dark:text-gray-400'>
            Enter the email associated with your account and we&apos;ll send a
            reset link.
          </p>
        </div>

        {/*  Correct form: Uses Formik */}
        <form className='space-y-6' onSubmit={formik.handleSubmit}>
          <div>
            <Label htmlFor='email' className='sr-only'>
              Email address
            </Label>

            <Input
              id='email'
              name='email'
              type='email'
              placeholder='Email address'
              autoComplete='email'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />

            {/*  Show validation error */}
            {formik.touched.email && formik.errors.email && (
              <p className='text-sm text-red-500 mt-1'>{formik.errors.email}</p>
            )}
          </div>

          <Button
            type='submit'
            className='w-full'
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Sending...' : 'Reset Password'}
          </Button>
        </form>

        <div className='flex justify-center'>
          <Link
            href={`/${role}/signin`}
            className='text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50'
            prefetch={false}
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
