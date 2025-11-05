import { DashboardLayout } from "@/components/dashboard-layout"
import { CategoriesTable } from "@/components/categories-table"

export default function CategoriesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categories Management</h1>
          <p className="text-muted-foreground">Organize and manage product categories</p>
        </div>

        <CategoriesTable />
      </div>
    </DashboardLayout>
  )
}
