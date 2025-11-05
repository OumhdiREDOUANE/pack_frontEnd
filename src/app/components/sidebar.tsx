"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Users,
  Package,
  ShoppingCart,
  ClipboardList,
  BarChart3,
  X,
  Tags,
  User,

Group,
  Settings,
  FileText,
  HelpCircle,
  Menu,
  UserCheck,
  Sliders,
} from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onToggle: () => void
  isCollapsed?: boolean
}

const navigation = [
  { name: "Dashboard", href: "/home", icon: BarChart3 },
  { name: "Users", href: "/users", icon: Users },
  { name: "Categories", href: "/categories", icon: Tags },
  { name: "Groups", href: "/groups", icon: Group },
  { name: "Products", href: "/products", icon: Package },
  { name: "Orders", href: "/orders", icon: ClipboardList },
   { name: "Cart", href: "/cart", icon: ShoppingCart },
  { name: "Proprietors", href: "/proprietors", icon: UserCheck },
  { name: "Proprietor Options", href: "/proprietor-options", icon: Sliders },

  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Blogs", href: "/blogs", icon: FileText },
  { name: "FAQ", href: "/faq", icon: HelpCircle },
]

export function Sidebar({ isOpen, onClose, onToggle, isCollapsed = false }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border transform transition-all duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "lg:w-16" : "w-64",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
            {!isCollapsed && <h2 className="text-lg font-semibold  text-sidebar-foreground">PackSpace</h2>}
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="hidden lg:flex text-sidebar-foreground  hover:bg-sidebar-accent"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isCollapsed ? "justify-center px-2" : "",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}
