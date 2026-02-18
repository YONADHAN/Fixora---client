import {axiosInstance} from '@/api/interceptor';
import { DashboardStatsParams } from '@/types/dashboard.types';
import { CUSTOMER_ROUTES} from '@/utils/constants/api.routes';

export const getCustomerDashboardStats = async (params: DashboardStatsParams) => {
    try {
        const response = await axiosInstance.get(`${CUSTOMER_ROUTES.DASHBOARD}`,{
            params,
        })
        return response.data.data
    } catch (error) {
        throw error
    }
}