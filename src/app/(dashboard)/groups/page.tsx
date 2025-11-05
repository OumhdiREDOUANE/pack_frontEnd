import { DashboardLayout } from "@/components/dashboard-layout"
import { GroupsTable } from "@/components/GroupsTable"

export default function GroupsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Groups Management</h1>
          <p className="text-muted-foreground">Organize and manage product groups</p>
        </div>

        <GroupsTable/>
      </div>
    </DashboardLayout>
  )
}
