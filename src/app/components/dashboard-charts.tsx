"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const ordersData = [
  { day: "Mon", orders: 45 },
  { day: "Tue", orders: 52 },
  { day: "Wed", orders: 38 },
  { day: "Thu", orders: 61 },
  { day: "Fri", orders: 55 },
  { day: "Sat", orders: 67 },
  { day: "Sun", orders: 43 },
]

const productsData = [
  { name: "Product A", sales: 120 },
  { name: "Product B", sales: 98 },
  { name: "Product C", sales: 86 },
  { name: "Product D", sales: 74 },
  { name: "Product E", sales: 65 },
]

export function DashboardCharts() {
 

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Orders per Day</CardTitle>
          <CardDescription>Daily order volume for the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              orders: {
                label: "Orders",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ordersData}>
                <XAxis
                  dataKey="day"
                  tick={{ fill: "hsl(var(--foreground))" }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis tick={{ fill: "hsl(var(--foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={{ stroke: "hsl(var(--border))" }} />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-1))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
          <CardDescription>Best selling products this month</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              sales: {
                label: "Sales",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productsData}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: "hsl(var(--foreground))" }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis tick={{ fill: "hsl(var(--foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={{ fill: "hsl(var(--muted))" }} />
                <Bar dataKey="sales" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
