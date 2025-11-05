import { DashboardLayout } from "@/components/dashboard-layout"
import { UsersTable } from "@/components/users-table"

export default function UsersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
          <p className="text-muted-foreground">Manage and monitor all users in your system</p>
        </div>

        <UsersTable/>
      </div>
    </DashboardLayout>
  )
}
