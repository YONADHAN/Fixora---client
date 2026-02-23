'use client'

import { useState } from 'react'

export interface ChangePasswordFormProps {
  onSubmit: (form: { currentPassword: string; newPassword: string }) => void
}

const ChangePasswordForm = ({ onSubmit }: ChangePasswordFormProps) => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <div className='p-4 max-w-md mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-md border dark:border-gray-800 transition-colors'>
      <h1 className='text-xl font-semibold mb-4 text-center text-gray-900 dark:text-gray-100'>
        Change Your Password
      </h1>
      <form onSubmit={handleFormSubmit} className='flex flex-col space-y-4'>
        <div>
          <label
            htmlFor='currentPassword'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
          >
            Current Password
          </label>
          <div className='relative'>
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              id='currentPassword'
              name='currentPassword'
              value={form.currentPassword}
              onChange={handleChange}
              className='w-full border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-slate-800 rounded-lg px-3 py-2 pr-10 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              required
            />
            <button
              type='button'
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            >
              {showCurrentPassword ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-5 h-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
                  />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-5 h-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor='newPassword'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
          >
            New Password
          </label>
          <div className='relative'>
            <input
              type={showNewPassword ? 'text' : 'password'}
              id='newPassword'
              name='newPassword'
              value={form.newPassword}
              onChange={handleChange}
              className='w-full border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-slate-800 rounded-lg px-3 py-2 pr-10 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              required
            />
            <button
              type='button'
              onClick={() => setShowNewPassword(!showNewPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            >
              {showNewPassword ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-5 h-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
                  />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-5 h-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type='submit'
          className='mt-2 bg-gray-700 hover:bg-gray-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white py-2 rounded-lg transition-colors'
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default ChangePasswordForm
