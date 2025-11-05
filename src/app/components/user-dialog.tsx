"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
  id_user: string
  nomComplet: string
  numero_telephone: string
  email: string
  role: "admin" | "user"
  created_at: string
}

interface UserDialogProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (userData: Omit<User, "id_user" | "created_at"> & { password?: string }) => void
}

export function UserDialog({ user, open, onOpenChange, onSave }: UserDialogProps) {
  const [formData, setFormData] = useState({
    nomComplet: "",
    numero_telephone: "",
    email: "",
    role: "user" as "admin" | "user",
    password: "",
  })

  useEffect(() => {
    if (user) {
      // 🔹 en mode édition : ne pas remplir password
      setFormData({
        nomComplet: user.nomComplet,
        numero_telephone: user.numero_telephone,
        email: user.email,
        role: user.role,
        password: "",
      })
    } else {
      // 🔹 en mode ajout
      setFormData({
        nomComplet: "",
        numero_telephone: "",
        email: "",
        role: "user",
        password: "",
      })
    }
  }, [user, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 🔹 si on édite et que password est vide → on ne l’envoie pas à Laravel
    const userData = { ...formData }
    if (user && !formData.password) {
      delete userData.password
    }

    onSave(userData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {user
              ? "Update user information below."
              : "Fill in the details to create a new user."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nomComplet">Full Name</Label>
              <Input
                id="nomComplet"
                value={formData.nomComplet}
                onChange={(e) => setFormData({ ...formData, nomComplet: e.target.value })}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="numero_telephone">Phone Number</Label>
              <Input
                id="numero_telephone"
                value={formData.numero_telephone}
                onChange={(e) => setFormData({ ...formData, numero_telephone: e.target.value })}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">
                {user ? "New Password (optional)" : "Password"}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={user ? "Leave empty to keep current password" : "Enter password"}
                required={!user} // 🔹 obligatoire seulement si création
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "admin" | "user") =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{user ? "Update" : "Create"} User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
