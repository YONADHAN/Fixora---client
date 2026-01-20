import { axiosInstance } from '@/api/interceptor'
import { ADMIN_ROUTES } from '@/utils/constants/api.routes'
import { DashboardStatsParams } from '@/types/dashboard.types'

export const getAdminDashboardStats = async (params: DashboardStatsParams) => {
  try {
    const response = await axiosInstance.get(
      ADMIN_ROUTES.GET_ADMIN_DASHBOARD_STATS,
      { params }
    )
    return response.data.data
  } catch (error) {
    throw error
  }
}
