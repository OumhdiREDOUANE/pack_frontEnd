import { DashboardLayout } from "@/components/dashboard-layout"
import { OrdersTable } from "@/components/orders-table"

export default function OrdersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders Management</h1>
          <p className="text-muted-foreground">Track and manage customer orders</p>
        </div>

        <OrdersTable />
      </div>
    </DashboardLayout>
  )
}
