"use client";

import React from "react";

export default function CustomerDashboardPage() {
  return (
    <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your dashboard. Bookings and activity will appear here.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900">Bookings</h3>
          <p className="text-sm text-gray-500 mt-2">View your recent bookings</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900">Profile</h3>
          <p className="text-sm text-gray-500 mt-2">Manage your account details</p>
        </div>
      </div>
    </div>
  );
}
