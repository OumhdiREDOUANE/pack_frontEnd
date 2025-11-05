import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react"

const stats = [
  {
    title: "Total Users",
    value: "2,543",
    change: "+12%",
    icon: Users,
  },
  {
    title: "Total Products",
    value: "1,234",
    change: "+8%",
    icon: Package,
  },
  {
    title: "Total Orders",
    value: "5,678",
    change: "+23%",
    icon: ShoppingCart,
  },
  {
    title: "Total Revenue",
    value: "$45,231",
    change: "+15%",
    icon: DollarSign,
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
