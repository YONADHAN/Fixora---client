import { axiosInstance } from '@/api/interceptor'
import { DashboardStatsParams } from '@/types/dashboard.types'
import { VENDOR_ROUTES } from '@/utils/constants/api.routes'

export const getVendorDashboardStats = async (params: DashboardStatsParams) => {
  try {
    const response = await axiosInstance.get(`${VENDOR_ROUTES.DASHBOARD}`, {
      params,
    })
    return response.data.data
  } catch (error) {
    throw error
  }
}
