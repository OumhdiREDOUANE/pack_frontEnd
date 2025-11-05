"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Clock, Mail, User, Calendar,Phone } from "lucide-react"

interface OrderItem {
  order_id: number
  prix_orderProduct:string
  product: {
    id_product: number
    name_product: string
    image: string | null
    
  } | null
  quantity?: number // in case you want to track quantity
}

interface Panier {
  panier_id: number
  user: {
    name: string | null
    email: string | null
    numero_telephone:string
  }
  orders: OrderItem[]
  status: "Pending" | "Completed" | "Delivered" | "Cancelled"
  total_prix: number
  created_at: string
}

interface CartDetailsDialogProps {
  cart: Panier | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartDetailsDialog({ cart, open, onOpenChange }: CartDetailsDialogProps) {
  if (!cart) return null

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

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString()

  const subtotal = cart.total_prix // assuming total_prix is already sum of items
 
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Cart Details - PAN-{cart.panier_id}</span>
            <Badge className={getStatusColor(cart.status)}>
              <ShoppingCart className="h-3 w-3 mr-1" />
              {cart.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>Created at {formatDate(cart.created_at)}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Customer Information</h3>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{cart.user?.name || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{cart.user?.email || "N/A"}</span>
              </div>
             <div className="flex items-center gap-2">
              <Phone  className="h-4 w-4 text-muted-foreground" />
               <span>{cart.user.numero_telephone }</span>
               </div>
            </div>
          </div>

          <Separator />

          {/* Cart Items */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Cart Items</h3>
            <div className="space-y-3">
              {cart.orders.map((item) => (
                <div key={item.order_id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <img
                    src={item.product?.image || "/placeholder.svg"}
                    alt={item.product?.name_product || ""}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product?.name_product || "N/A"}</h4>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity || 1}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.prix_orderProduct} DH</p>
                  
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

         

          {/* Order Summary */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <div className="space-y-2">
              
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>{cart.total_prix} DH</span>
              </div>
            </div>
          </div>

          

          <Separator />

          {/* Actions */}
          <div className="flex justify-end">
           
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
