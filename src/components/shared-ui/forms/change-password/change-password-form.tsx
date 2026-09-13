'use client'

import { useState } from 'react'
import { Eye, EyeOff, Lock, KeyRound } from 'lucide-react'

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
    <div className='w-full max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-800 p-8'>
      <div className='mb-8 text-center'>
        <div className='w-12 h-12 bg-blue-50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700 rounded-full flex items-center justify-center mx-auto mb-4'>
          <Lock className='w-5 h-5 text-blue-600 dark:text-blue-400' />
        </div>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Change Password
        </h1>
        <p className='text-gray-500 dark:text-gray-400 text-sm mt-2'>
          Ensure your account is using a long, random password to stay secure.
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className='space-y-6'>
        {/* Current Password */}
        <div>
          <label
            htmlFor='currentPassword'
            className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'
          >
            Current Password
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none'>
              <KeyRound className='h-4 w-4 text-gray-400' />
            </div>
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              id='currentPassword'
              name='currentPassword'
              value={form.currentPassword}
              onChange={handleChange}
              className='block w-full pl-10 pr-12 py-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors text-sm'
              placeholder='Enter current password'
              required
            />
            <button
              type='button'
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className='absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
            >
              {showCurrentPassword ? (
                <EyeOff className='h-4 w-4' />
              ) : (
                <Eye className='h-4 w-4' />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label
            htmlFor='newPassword'
            className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'
          >
            New Password
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none'>
              <Lock className='h-4 w-4 text-gray-400' />
            </div>
            <input
              type={showNewPassword ? 'text' : 'password'}
              id='newPassword'
              name='newPassword'
              value={form.newPassword}
              onChange={handleChange}
              className='block w-full pl-10 pr-12 py-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors text-sm'
              placeholder='Enter new password'
              required
            />
            <button
              type='button'
              onClick={() => setShowNewPassword(!showNewPassword)}
              className='absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
            >
              {showNewPassword ? (
                <EyeOff className='h-4 w-4' />
              ) : (
                <Eye className='h-4 w-4' />
              )}
            </button>
          </div>
          <p className='text-[13px] text-gray-500 dark:text-gray-400 mt-2 leading-tight'>
            Must be at least 6 characters and include uppercase, lowercase, number, and special character.
          </p>
        </div>

        <button
          type='submit'
          className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:focus:ring-offset-slate-900 text-sm'
        >
          Update Password
        </button>
      </form>
    </div>
  )
}

export default ChangePasswordForm
