export type TimeGranularity = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface DashboardStatsParams {
  from?: string; // YYYY-MM-DD
  to?: string;   // YYYY-MM-DD
  interval: TimeGranularity;
}

export interface SummaryAnalyticsResponseDTO {
  totalActiveUsers?: number;
  blockedCustomers?: number;
  activeCustomers?: number;
  blockedVendors?: number;
  activeVendors?: number;
  totalBookings?: number;
  cancelledBookings?: number;
  totalRevenue?: number;
}

export interface BookingDashboardResponseDTO {
  bookingGrowth: {
    label: string;
    totalBookings: number;
  }[];
  bookingStatusBreakdown: {
    scheduled: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
}

export interface VendorDashboardResponseDTO {
  vendorGrowth: {
    label: string;
    totalVendors: number;
  }[];
  vendorStatusBreakdown: {
    pending: number;
    active: number;
    blocked: number;
  };
}

export interface CustomerDashboardResponseDTO {
  customerGrowth: {
    label: string;
    totalCustomers: number;
  }[];
  customerStatusBreakdown: {
    active: number;
    blocked: number;
  };
}

export interface ServiceDashboardResponseDTO {
  serviceGrowth: {
    label: string;
    totalServices: number;
  }[];
  serviceStatusOverview: {
    totalServices: number;
    activeServices: number;
    inactiveServices: number;
  };
  serviceUsageOverview: {
    servicesWithBookings: number;
    servicesWithoutBookings: number;
  };
  topServices: {
    serviceId: string;
    serviceName: string;
    totalBookings: number;
  }[];
}

export interface AdminDashboardResponseDTO {
  summary: SummaryAnalyticsResponseDTO;
  booking: BookingDashboardResponseDTO;
  vendor: VendorDashboardResponseDTO;
  customer: CustomerDashboardResponseDTO;
  service: ServiceDashboardResponseDTO;
}

export interface VendorDashboardStatsResponseDTO {
  summary: SummaryAnalyticsResponseDTO;
  booking: BookingDashboardResponseDTO;
  customer: CustomerDashboardResponseDTO;
}
