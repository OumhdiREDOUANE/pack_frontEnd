"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { OrderDetailsDialog } from "@/components/order-details-dialog"
import { Search, Eye, CheckCircle, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface OrderItem {
  id: number
  name: string
  name_proprieter: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: number
  uuid: string
  customerName: string
  customerEmail: string
  numero_telephone: string
  items: OrderItem[]
  total: number
  status: "Registered" | "Validated"
  orderDate: string
  productImage: string
  name_product: string
}

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_URL}/api/OrderDashboard`)
        if (!res.ok) throw new Error("Failed to fetch orders")
        const data = await res.json()
     console.log(data)
        const orders: Order[] = data.data.map((op: any) => ({
          id: op.id_orderProduct,
          name_product: op.product.name_product,
          uuid: op.uuid,
          customerName: op.user?.name || op.user?.email.split("@")[0],
          customerEmail: op.user?.email,
          items: op.product.proprieter.map((p: any) => ({
            name_proprieter: p.name_proprieter,
            id: p.options.id_ProductOption,
            name: p.options.name_option,
            price: parseFloat(p.options.prix),
            image: op.product.image?.url_image,
          })),
          numero_telephone: op.user?.numero_telephone,
          total: op.prix_total,
          status: op.status,
          orderDate: op.created_at,
          productImage: op.product.image?.url_image,
        }))
        setOrders(orders)
      } catch (err: any) {
        setError("Error fetching orders")
       
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [API_URL])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =

      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsOrderDetailsOpen(true)
  }

  const handleUpdateOrderStatus = (orderId: number, newStatus: Order["status"]) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Registered":
        return "bg-blue-100 text-blue-800"
      case "Validated":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Registered":
        return <Clock className="h-3 w-3" />
      case "Validated":
        return <CheckCircle className="h-3 w-3" />
      default:
        return null
    }
  }

  const getOrderTotal = () => filteredOrders.reduce((sum, order) => sum + order.total, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
            <p className="text-sm text-muted-foreground">Total Value: {getOrderTotal().toFixed(2)} DH</p>
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Registered">Registered</SelectItem>
              <SelectItem value="Validated">Validated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
  {loading ? (
    <TableRow>
      <TableCell colSpan={7} className="text-center py-10 text-gray-500">
        Loading orders...
      </TableCell>
    </TableRow>
  ) : error ? (
    <TableRow>
      <TableCell colSpan={7} className="text-center py-10 text-red-500">
        error
      </TableCell>
    </TableRow>
  ) : filteredOrders.length > 0 ? (
    filteredOrders.map((order) => (
      <TableRow key={order.id}>
        <TableCell className="font-medium">ORD-{order.id}</TableCell>
        <TableCell>
          <div>
            <div className="font-medium">{order.customerName}</div>
            <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <img
                key={order.id}
                src={order.productImage || "/placeholder.svg"}
                className="h-10 w-10 rounded-md object-cover"
              />
            </div>
            <span className="text-sm text-muted-foreground">{order.name_product}</span>
          </div>
        </TableCell>
        <TableCell>{order.total.toFixed(2)} DH</TableCell>
        <TableCell>
          <Badge className={getStatusColor(order.status)}>
            {getStatusIcon(order.status)}
            <span className="ml-1 capitalize">{order.status}</span>
          </Badge>
        </TableCell>
        <TableCell>{order.orderDate}</TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
            <Eye className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
        No orders found.
      </TableCell>
    </TableRow>
  )}
</TableBody>


            </Table>
          </div>
        
      </CardContent>

      <OrderDetailsDialog
        order={selectedOrder}
        open={isOrderDetailsOpen}
        onOpenChange={setIsOrderDetailsOpen}
        onUpdateStatus={handleUpdateOrderStatus}
      />
    </Card>
  )
}
