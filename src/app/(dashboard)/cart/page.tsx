import { DashboardLayout } from "@/components/dashboard-layout"
import { CartOverview } from "@/components/cart-overview"

export default function CartPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cart Overview</h1>
          <p className="text-muted-foreground">Monitor active and abandoned shopping carts</p>
        </div>

        <CartOverview />
      </div>
    </DashboardLayout>
  )
}
