import { axiosInstance } from '@/api/interceptor'
import { SubscriptionPlan } from '@/types/subscription/subscription.type'
import { ADMIN_ROUTES } from '@/utils/constants/api.routes'

export const AdminSubscriptionService = {
  getPlans: (params: { page: number; limit: number; search?: string }) =>
    axiosInstance.get(ADMIN_ROUTES.GET_SUBSCRIPTION_PLANS, { params }),

  createPlan: (payload: SubscriptionPlan) =>
    axiosInstance.post(ADMIN_ROUTES.CREATE_SUBSCRIPTION_PLANS, payload),

  updatePlan: (planId: string, payload: Partial<SubscriptionPlan>) =>
    axiosInstance.patch(
      `${ADMIN_ROUTES.UPDATE_SUBSCRIPTION_PLANS}/${planId}`,
      payload,
    ),

  togglePlan: (planId: string) =>
    axiosInstance.patch(
      `${ADMIN_ROUTES.TOGGLE_SUBSCRIPTION_PLANS}/${planId}/toggle`,
    ),
}
