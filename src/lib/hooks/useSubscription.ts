import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AdminSubscriptionService } from '@/services/subscription/admin_subscription_service'
import { EditSubscriptionPlan } from '@/types/subscription/subscription.type'
import { VendorSubscriptionService } from '@/services/subscription/vendor_subscription_service'
import { toast } from 'sonner'
import { AxiosError } from 'axios'

export const useAdminSubscriptionPlans = (
  page: number,
  limit: number,
  search?: string,
) => {
  return useQuery({
    queryKey: ['admin-subscription-plans', page, search],
    queryFn: async () => {
      const res = await AdminSubscriptionService.getPlans({
        page,
        limit,
        search,
      })
      return res.data
    },
    // keepPreviousData: true,
  })
}

export const useCreateSubscriptionPlan = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: AdminSubscriptionService.createPlan,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-subscription-plans'] })
    },
  })
}

export const useUpdateSubscriptionPlan = (planId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: EditSubscriptionPlan) =>
      AdminSubscriptionService.updatePlan(planId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-subscription-plans'] })
    },
  })
}

export const useToggleSubscriptionPlan = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (planId: string) => AdminSubscriptionService.togglePlan(planId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-subscription-plans'] })
    },
  })
}

export const useActiveSubscriptionPlans = (
  page = 1,
  limit = 10,
  search = '',
) => {
  return useQuery({
    queryKey: ['vendor-subscription-plans', page, search],
    queryFn: async () => {
      const res = await VendorSubscriptionService.getActivePlans({
        page,
        limit,
        search,
      })
      return res.data
    },
  })
}

export const useCreateSubscriptionCheckout = () => {
  return useMutation({
    mutationFn: (planId: string) =>
      VendorSubscriptionService.createCheckout(planId),

    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          'Something went wrong'

        toast.error(message)
      }
    },
  })
}
