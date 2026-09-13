'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter, usePathname } from 'next/navigation'

import { useAdminLogout } from '@/lib/hooks/useAdmin'
import { useVendorLogout } from '@/lib/hooks/useVendor'
import { useCustomerLogout } from '@/lib/hooks/useCustomer'
import { Menu } from 'lucide-react'
import { BiSolidBell } from 'react-icons/bi'
import { useDispatch } from 'react-redux'
import { customerLogout } from '@/store/slices/customer.slice'
import { vendorLogout } from '@/store/slices/vendor.slice'
import { adminLogout } from '@/store/slices/admin.slice'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ModeToggle } from '../ui/modeToggle'

import { navData } from '../data/NavData'
import { toast } from 'sonner'
import { useNotifications } from '@/lib/hooks/useNotification'

import { useNotificationsSocket } from '@/lib/hooks/useNotificationsSocket'
import { NotificationModal } from './NotificationModal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface NavbarProps {
  role?: 'admin' | 'vendor' | 'customer'
  isAuthenticated: boolean
}

export default function Navbar({
  role = 'customer',
  isAuthenticated,
}: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useDispatch()
  const { topNav, sideNav } = navData[role]

  const customerLogoutHook = useCustomerLogout()
  const vendorLogoutHook = useVendorLogout()
  const adminLogoutHook = useAdminLogout()

  // Initialize socket listener for notifications
  useNotificationsSocket(isAuthenticated)

  const { unreadCount } = useNotifications('all', isAuthenticated)

  const logoutActions = {
    admin: adminLogoutHook,
    customer: customerLogoutHook,
    vendor: vendorLogoutHook,
  } as const

  const onLogout = async () => {
    try {
      // Select correct logout hook dynamically
      const logoutHook = logoutActions[role]
      if (!logoutHook) {
        toast.error('Invalid role logout')
        return
      }

      // Call mutateAsync from correct hook
      const res = await logoutHook.mutateAsync()

      if (!res) {
        toast.error('Failed to logout')
        return
      }

      // Clear redux state
      switch (role) {
        case 'admin':
          dispatch(adminLogout())
          break
        case 'vendor':
          dispatch(vendorLogout())
          break
        case 'customer':
          dispatch(customerLogout())
          break
      }

      toast.success(res?.data?.message || 'Logged out successfully')
      router.push(`/${role}/signin?returnUrl=${encodeURIComponent(pathname)}`)
    } catch (error) {
      toast.error('Logout failed')
      console.error(error)
    }
  }

  return (
    <header className='w-full shadow-md sticky top-0 z-50 bg-white dark:bg-gray-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16'>
        {/* Left Section */}
        <div className='flex items-center gap-3'>
          {/* Mobile Menu - Always show on mobile */}
          <Sheet>
            <SheetTrigger asChild className='md:hidden px-2'>
              <Button variant='ghost' size='icon'>
                <Menu className='h-6 w-6' />
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-72 border-r-0 shadow-2xl p-0 flex flex-col'>
              <div className='p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-900/50'>
                <SheetTitle className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                  Fixora {role.charAt(0).toUpperCase() + role.slice(1)}
                </SheetTitle>
              </div>

              <div className='flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-6'>
                {/* Show top nav items on mobile */}
                <div className='flex flex-col gap-1.5'>
                  <p className='text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-2'>Main Menu</p>
                  {topNav.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {item.title}
                      </Link>
                    )
                  })}
                </div>

                {/* Show side nav items if authenticated */}
                {isAuthenticated && sideNav.length > 0 && (
                  <div className='flex flex-col gap-1.5'>
                    <p className='text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-2'>Dashboard</p>
                    {sideNav.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                          {item.title}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Auth buttons for mobile */}
              <div className='p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-900/50'>
                {isAuthenticated ? (
                  <Button
                    variant='destructive'
                    onClick={onLogout}
                    className='w-full rounded-xl'
                  >
                    Logout
                  </Button>
                ) : (
                  <div className='flex flex-col gap-2'>
                    <Button
                      variant='outline'
                      onClick={() => router.push(`/${role}/signin?returnUrl=${encodeURIComponent(pathname)}`)}
                      className='w-full rounded-xl'
                    >
                      Login
                    </Button>
                    {role !== 'admin' && (
                      <Button
                        onClick={() => router.push(`/${role}/signup`)}
                        className='w-full rounded-xl'
                      >
                        Sign Up
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Sidebar - Only show if authenticated */}
          {isAuthenticated && (
            <Sheet>
              <SheetTrigger asChild className='hidden md:block px-2'>
                <Button variant='ghost' size='icon'>
                  <Menu className='h-6 w-6' />
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className='w-72 border-r-0 shadow-2xl p-0 flex flex-col'>
              <div className='p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-900/50'>
                <SheetTitle className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                  Fixora {role.charAt(0).toUpperCase() + role.slice(1)}
                </SheetTitle>
              </div>

              <div className='flex-1 overflow-y-auto py-6 px-4'>
                <p className='text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-2'>Navigation</p>
                <nav className='flex flex-col gap-1.5'>
                  {sideNav.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                        {item.title}
                      </Link>
                    )
                  })}
                </nav>
              </div>

              <div className='p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-900/50'>
                <Button
                  variant='destructive'
                  onClick={onLogout}
                  className='w-full rounded-xl'
                >
                  Logout
                </Button>
              </div>
            </SheetContent>
            </Sheet>
          )}

          <Link
            href='/'
            className='text-xl font-bold text-gray-800 dark:text-white'
          >
            Fixora
          </Link>
        </div>

        {/* Center (Top Nav for desktop) */}
        <nav className='hidden md:flex space-x-6'>
          {topNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className='hover:text-blue-600 dark:text-gray-200'
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Right: Auth Buttons + Dark Mode */}
        <div className='flex items-center gap-4'>
          <ModeToggle />

          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='relative hidden sm:flex'>
                    <BiSolidBell size={20} />

                    {unreadCount > 0 && (
                      <span
                        className='absolute -top-1 -right-1 min-w-[18px] h-[18px] 
      rounded-full bg-red-600 text-white text-xs 
      flex items-center justify-center px-1'
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='p-0 border-none shadow-none bg-transparent w-auto'>
                  <NotificationModal />
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant='destructive'
                onClick={onLogout}
                className='hidden md:flex'
              >
                Logout
              </Button>
            </>
          ) : (
            <div className='flex place-items-center gap-2'>
              <Button
                variant='outline'
                onClick={() => router.push(`/${role}/signin?returnUrl=${encodeURIComponent(pathname)}`)}
                className='hidden sm:flex'
              >
                Login
              </Button>
              {role !== 'admin' && (
                <Button
                  onClick={() => router.push(`/${role}/signup`)}
                  className='px-3 py-1'
                >
                  Sign Up
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
