"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CartDetailsDialog } from "@/components/cart-details-dialog"
import { Search, Eye, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Cookies from "js-cookie"

interface OrderItem {
  order_id: number
  prix_orderProduct: string
  product: {
    id_product: number
    name_product: string
    image: string | null
  } | null
}

interface Panier {
  panier_id: number
  role: string
  user: {
    id_user: number | null
    name: string | null
    numero_telephone: string | null
    email: string | null
  }
  orders: OrderItem[]
  status: "Pending" | "Completed" | "Delivered" | "Cancelled"
  total_prix: number
  created_at: string
}

export function CartOverview() {
  const [carts, setCarts] = useState<Panier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedCart, setSelectedCart] = useState<Panier | null>(null)
  const [isCartDetailsOpen, setIsCartDetailsOpen] = useState(false)

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const token = Cookies.get("token") || ""
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

        const res = await fetch(`${API_URL}/api/CartDashboard`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })

        if (!res.ok) throw new Error(`HTTP error!`)

        const data = await res.json()
        setCarts(data)
      } catch (err: any) {
        setError("Error fetching carts")
        throw new Error("Erreur lors du chargement des commandes");
      } finally {
        setLoading(false)
      }
    }

    fetchCarts()
  }, [])

  const filteredCarts = carts.filter((cart) => {
    const matchesSearch =
      cart.panier_id.toString().includes(searchTerm.toLowerCase()) ||
      cart.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cart.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || cart.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleViewCart = (cart: Panier) => {
    setSelectedCart(cart)
    setIsCartDetailsOpen(true)
  }

  const handleChangeStatus = async (cartId: number, newStatus: Panier["status"]) => {
    try {
       const token = Cookies.get("token") || ""
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
      const res = await fetch(`${API_URL}/api/CartDashboard/${cartId}`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error("Failed to update status")
console.log(res)
      setCarts((prev) =>
        prev.map((c) => (c.panier_id === cartId ? { ...c, status: newStatus } : c))
      )
    } catch (err) {
         throw new Error(err);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Delivered":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Paniers ({filteredCarts.length})</CardTitle>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search carts..."
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
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2">Loading carts...</span>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">error</div>
          ) : filteredCarts.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No carts found.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Panier ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCarts.map((cart) => (
                    <TableRow key={cart.panier_id}>
                      <TableCell>PAN-{cart.panier_id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{cart.user?.name}</div>
                          <div className="text-sm text-muted-foreground">{cart.user?.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {cart.orders.slice(0, 3).map((order, index) => (
                              <img
                                key={order.order_id}
                                src={order.product?.image || "/placeholder.svg"}
                                alt={order.product?.name_product || ""}
                                className="h-8 w-8 rounded-full border-2 border-background object-cover"
                                style={{ zIndex: cart.orders.length - index }}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {cart.orders.length} item{cart.orders.length > 1 ? "s" : ""}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{cart.total_prix} DH</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(cart.status)}>{cart.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(cart.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewCart(cart)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {
                            cart.role =='admin'&&(

                          <Select
                            value={cart.status}
                            onValueChange={(val) =>
                              handleChangeStatus(cart.panier_id, val as Panier["status"])
                            }
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                              <SelectItem value="Delivered">Delivered</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                            )
                          }
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <CartDetailsDialog
        cart={selectedCart}
        open={isCartDetailsOpen}
        onOpenChange={setIsCartDetailsOpen}
      />
    </div>
  )
}
