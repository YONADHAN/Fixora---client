import { axiosInstance } from '@/api/interceptor'
import { VENDOR_ROUTES } from '@/utils/constants/api.routes'

export const VendorSubscriptionService = {
  getActivePlans: (params?: {
    page?: number
    limit?: number
    search?: string
  }) =>
    axiosInstance.get(VENDOR_ROUTES.GET_ACTIVE_SUBSCRIPTION_PLANS, {
      params,
    }),

  createCheckout: (planId: string) =>
    axiosInstance.post(VENDOR_ROUTES.CREATE_SUBSCRIPTION_CHECKOUT, {
      planId,
    }),
}
