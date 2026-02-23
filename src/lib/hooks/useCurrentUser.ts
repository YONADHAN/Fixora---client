import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

export type ChatUser =
  | { id: string; role: 'customer' }
  | { id: string; role: 'vendor' }
  | { id: string; role: 'admin' }
  | null

export function useCurrentUser(): ChatUser {
  const customer = useSelector((state: RootState) => state.customer.customer)
  const vendor = useSelector((state: RootState) => state.vendor.vendor)
  const admin = useSelector((state: RootState) => state.admin.admin)

  if (customer) {
    return { id: customer.userId, role: 'customer' }
  }

  if (vendor) {
    return { id: vendor.userId, role: 'vendor' }
  }

  if (admin) {
    return { id: admin.userId, role: 'admin' }
  }

  return null
}
