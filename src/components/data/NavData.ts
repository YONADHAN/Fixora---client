import {
  FaUser,
  FaUsers,
  FaStore,
  FaLock,
  FaServicestack,
  FaScrewdriver,
  FaRegAddressBook,
  FaMoneyBill,
  FaMoneyCheck,
  FaRegBookmark,
  FaWallet,
} from 'react-icons/fa'

import { HiChat, HiDocumentSearch } from 'react-icons/hi'
import { User2 } from 'lucide-react'

export interface NavItem {
  title: string
  href: string
}

export interface SideBarItem {
  title: string
  href: string
  icon: React.ComponentType
}

export interface RoleMenus {
  topNav: NavItem[]
  sideNav: SideBarItem[]
}

export const navData: Record<'admin' | 'vendor' | 'customer', RoleMenus> = {
  admin: {
    topNav: [
      //{ title: 'Dashboard', href: '/admin/dashboard' }
    ],
    sideNav: [
      // { title: 'Dashboard', href: '/admin/dashboard', icon: FaHome },
      {
        title: 'Customers',
        href: '/admin/dashboard/management/customer-management',
        icon: FaUsers,
      },
      {
        title: 'Vendors',
        href: '/admin/dashboard/management/vendor-management',
        icon: FaStore,
      },
      {
        title: 'Requests',
        href: '/admin/dashboard/management/request-management',
        icon: HiDocumentSearch,
      },
      {
        title: 'wallet',
        href: '/admin/dashboard/wallet',
        icon: FaWallet,
      },
      {
        title: 'Service Categories',
        href: '/admin/dashboard/service_category',
        icon: FaServicestack,
      },
      {
        title: 'Sub Service Categories',
        href: '/admin/dashboard/sub-service-category',
        icon: FaScrewdriver,
      },
    ],
  },

  vendor: {
    topNav: [
      // { title: 'Dashboard', href: '/vendor/dashboard' },
      // { title: 'Profile', href: '/vendor/profile' },
    ],
    sideNav: [
      { title: 'My profile', href: '/vendor/profile', icon: User2 },
      {
        title: 'My services',
        href: '/vendor/service',
        icon: FaScrewdriver,
      },

      {
        title: 'Sub Service Category',
        href: '/vendor/sub-service-category',
        icon: FaServicestack,
      },
      {
        title: 'Booking requests',
        href: '/vendor/booking/list',
        icon: FaRegBookmark,
      },
      {
        title: 'My Wallet',
        href: '/vendor/wallet',
        icon: FaWallet,
      },
      {
        title: 'Payment History',
        href: '/vendor/payment',
        icon: FaMoneyCheck,
      },
      {
        title: 'Change my password',
        href: '/vendor/change-password',
        icon: FaLock,
      },

      //{ title: 'Dashboard', href: '/vendor/dashboard', icon: FaHome },
      // { title: 'Customers', href: '/vendor/customers', icon: FaUsers },
      // {
      //   title: 'Notifications',
      //   href: '/vendor/notifications',
      //   icon: BiSolidBell,
      // },
    ],
  },

  customer: {
    topNav: [
      // { title: 'Services', href: '/' },
      // { title: 'Profile', href: '/customer/profile' },
    ],
    sideNav: [
      { title: 'My profile', href: '/customer/profile', icon: FaUser },
      {
        title: 'My bookings',
        href: '/customer/booking/list',
        icon: FaRegAddressBook,
      },
      { title: 'My Wallet', href: '/customer/wallet', icon: FaMoneyBill },
      {
        title: 'Payment History',
        href: '/customer/payments',
        icon: FaMoneyCheck,
      },
      {
        title: 'Chat',
        href: '/customer/chat',
        icon: HiChat,
      },
      {
        title: 'Change Password',
        href: '/customer/change-password',
        icon: FaLock,
      },
      // { title: 'Services', href: '/services', icon: FaServicestack },
      // { title: 'Dashboard', href: '/customer/dashboard', icon: FaHome },
    ],
  },
}
