"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Package, Truck, CheckCircle, XCircle, User, Mail, MapPin } from "lucide-react"

interface OptionItem {
  id_option: number
  name_option: string
  prix: number
}

interface ProprieterItem {
  id_proprieter: number
  name_proprieter: string
  options: OptionItem
}

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: number
  uuid: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  total: number
  status: "Registered" | "Validated"
  orderDate: string
  shippingAddress?: string
  productImage: string
  proprieter: ProprieterItem[]
}

interface OrderDetailsDialogProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateStatus: (orderId: number, status: Order["status"]) => void
}

export function OrderDetailsDialog({ order, open, onOpenChange, onUpdateStatus }: OrderDetailsDialogProps) {
  if (!order) return null

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
        return <Clock className="h-4 w-4" />
      case "Validated":
        return <CheckCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details - {order.uuid}</span>
            <Badge className={getStatusColor(order.status)}>
              {getStatusIcon(order.status)}
              <span className="ml-1 capitalize">{order.status}</span>
            </Badge>
          </DialogTitle>
          <DialogDescription>Order placed on {order.orderDate}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Customer Info */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Customer Information</h3>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{order.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{order.customerEmail}</span>
              </div>
              {order.shippingAddress && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{order.shippingAddress}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Products & Options */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Products & Options</h3>
            <div className="flex flex-col gap-4">
              {order.items.map((item) => (
                <div key={item.id} className="border rounded-lg p-3">
                  <div className="flex items-center gap-4">
                    <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-16 w-16 object-cover rounded-md" />
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  {/* Proprieter & Options */}
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {order.proprieter.map((p) => (
                      <div key={p.id_proprieter} className="flex flex-col border p-2 rounded-md">
                        <span className="font-medium">{p.name_proprieter}</span>
                        <span className="text-sm">{p.options.name_option}</span>
                        <span className="text-sm font-semibold">${p.options.prix}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          {/* Update Status */}
          <div className="flex items-center gap-4">
            <Select value={order.status} onValueChange={(value: Order["status"]) => onUpdateStatus(order.id, value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Registered">Registered</SelectItem>
                <SelectItem value="Validated">Validated</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
