"use client";

import React, { useState } from "react";
import { useVendorDashboardStats } from "@/hooks/useDashboardStats";
import { TimeGranularity } from "@/types/dashboard.types";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { LineChartWidget } from "@/components/dashboard/LineChartWidget";
import { PieChartWidget } from "@/components/dashboard/PieChartWidget";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Users, Calendar, TrendingUp, DollarSign } from "lucide-react";

export default function VendorDashboardPage() {
  const [interval, setInterval] = useState<TimeGranularity>("daily");
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});

  const { data, loading, error } = useVendorDashboardStats({
    interval,
    from: dateRange.from,
    to: dateRange.to,
  });

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  const { summary, booking, customer } = data || {};

  return (
    <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendor Dashboard</h1>
          <p className="text-muted-foreground">
            Track your appointments and earnings.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Input
            type="date"
            className="w-[150px]"
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, from: e.target.value }))
            }
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="date"
            className="w-[150px]"
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, to: e.target.value }))
            }
          />
          <Select
            value={interval}
            onValueChange={(val) => setInterval(val as TimeGranularity)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Earnings"
          value={`₹${summary?.totalRevenue?.toLocaleString() ?? 0}`}
          icon={DollarSign}
        />
        <MetricCard
          title="Total Bookings"
          value={summary?.totalBookings}
          icon={Calendar}
          description={`${summary?.cancelledBookings ?? 0} cancelled`}
        />
        <MetricCard
          title="Active Customers"
          value={summary?.activeCustomers}
          icon={Users}
          description="Unique customers"
        />
        {/* Intentionally omitting Active Vendors card as it's not relevant for Vendor view */}
        <MetricCard
          title="Scheduled Bookings"
          value={booking?.bookingStatusBreakdown?.scheduled ?? 0}
          icon={TrendingUp}
          description="Total scheduled"
        />
      </div>

      {/* Sections */}
      <div className="space-y-10">

        {/* Booking Analytics */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Booking Analytics</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {booking?.bookingGrowth && (
              <LineChartWidget
                title="Booking Growth"
                data={booking.bookingGrowth}
                dataKey="totalBookings"
                xAxisKey="label"
              />
            )}
            {booking?.bookingStatusBreakdown && (
              <PieChartWidget
                title="Booking Status"
                data={[
                  { name: "Scheduled", value: booking.bookingStatusBreakdown.scheduled },
                  { name: "In Progress", value: booking.bookingStatusBreakdown.inProgress },
                  { name: "Completed", value: booking.bookingStatusBreakdown.completed },
                  { name: "Cancelled", value: booking.bookingStatusBreakdown.cancelled },
                ]}
              />
            )}
          </div>
        </section>

        {/* Customer Analytics */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Customer Analytics</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {customer?.customerGrowth && (
              <LineChartWidget
                title="Customer Growth"
                data={customer.customerGrowth}
                dataKey="totalCustomers"
                color="#9333ea"
              />
            )}
            {customer?.customerStatusBreakdown && (
              <PieChartWidget
                title="Customer Breakdown"
                data={[
                  { name: "Active", value: customer.customerStatusBreakdown.active },
                  { name: "Blocked", value: customer.customerStatusBreakdown.blocked },
                ]}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
