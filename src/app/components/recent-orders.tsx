"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, ArrowRight } from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  customer: string
  email: string
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  date: string
  items: number
}

const recentOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "John Smith",
    email: "john.smith@email.com",
    total: 299.99,
    status: "processing",
    date: "2024-01-15",
    items: 2,
  },
  {
    id: "ORD-002",
    customer: "Sarah Johnson",
    email: "sarah.j@email.com",
    total: 159.99,
    status: "shipped",
    date: "2024-01-14",
    items: 1,
  },
  {
    id: "ORD-003",
    customer: "Mike Davis",
    email: "mike.davis@email.com",
    total: 89.99,
    status: "delivered",
    date: "2024-01-13",
    items: 3,
  },
]

export function RecentOrders() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Link href="/orders">
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div>
                  <div className="font-medium">{order.id}</div>
                  <div className="text-sm text-muted-foreground">{order.customer}</div>
                  <div className="text-xs text-muted-foreground">{order.email}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-medium">${order.total.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">{order.items} items</div>
                  <div className="text-xs text-muted-foreground">{order.date}</div>
                </div>
                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
