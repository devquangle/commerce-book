import React from "react";
import {
  DashboardHeader,
  StatCards,
  PendingActionCards,
  RecentActivities,
  TopRevenueShops,
} from "../dashboard/components";
import {
  DASHBOARD_DATE,
  SUPER_ADMIN_NAME,
  STAT_METRICS_DATA,
  PENDING_LEFT_DATA,
  PENDING_RIGHT_DATA,
  RECENT_ACTIVITIES_DATA,
  TOP_SHOPS_DATA,
} from "../dashboard/services/dashboardData";

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      <DashboardHeader dateText={DASHBOARD_DATE} adminName={SUPER_ADMIN_NAME} />

      <StatCards metrics={STAT_METRICS_DATA} />

      <PendingActionCards leftItems={PENDING_LEFT_DATA} rightItems={PENDING_RIGHT_DATA} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities activities={RECENT_ACTIVITIES_DATA} />
        <TopRevenueShops shops={TOP_SHOPS_DATA} />
      </div>
    </div>
  );
};

export default AdminDashboard;
