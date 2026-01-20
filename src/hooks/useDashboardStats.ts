import { useState, useEffect, useCallback } from 'react';
import { getAdminDashboardStats } from '@/services/admin/adminDashboard.service';
import { getVendorDashboardStats } from '@/services/vendor/vendorDashboard.service';
import {
    AdminDashboardResponseDTO,
    VendorDashboardStatsResponseDTO,
    DashboardStatsParams
} from '@/types/dashboard.types';

interface UseDashboardStatsResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useAdminDashboardStats = (
    params: DashboardStatsParams
): UseDashboardStatsResult<AdminDashboardResponseDTO> => {
    const [data, setData] = useState<AdminDashboardResponseDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getAdminDashboardStats(params);
            setData(result);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch admin dashboard stats');
        } finally {
            setLoading(false);
        }
    }, [params.from, params.to, params.interval]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};

export const useVendorDashboardStats = (
    params: DashboardStatsParams
): UseDashboardStatsResult<VendorDashboardStatsResponseDTO> => {
    const [data, setData] = useState<VendorDashboardStatsResponseDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getVendorDashboardStats(params);
            setData(result);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch vendor dashboard stats');
        } finally {
            setLoading(false);
        }
    }, [params.from, params.to, params.interval]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};
