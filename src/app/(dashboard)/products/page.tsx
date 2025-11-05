import { DashboardLayout } from "@/components/dashboard-layout"
import { ProductsTable } from "@/components/products-table"

export default function ProductsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products Management</h1>
          <p className="text-muted-foreground">Manage your product catalog and inventory</p>
        </div>

        <ProductsTable />
      </div>
    </DashboardLayout>
  )
}
