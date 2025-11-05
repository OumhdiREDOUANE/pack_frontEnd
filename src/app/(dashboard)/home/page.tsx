import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCards } from "@/components/stats-cards"
import { DashboardCharts } from "@/components/dashboard-charts"
import { RecentOrders } from "@/components/recent-orders"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your project management dashboard</p>
        </div>

       
      </div>
    </DashboardLayout>
  )
}
