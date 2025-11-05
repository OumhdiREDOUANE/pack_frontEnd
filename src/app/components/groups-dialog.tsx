"use client"

import React, { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select"

interface Category {
  id_categorie: number
  name_categorie: string
}

interface group {
  id_group: number
  name_group: string
  description_group: string
  categorie_id: number
  name_categorie?: string
}

interface GroupsDialogProps {
  group: group | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: FormData) => void
}

export function GroupsDialog({ group, open, onOpenChange, onSave }: GroupsDialogProps) {
  const [formData, setFormData] = useState({
    name_group: "",
    description_group: "",
    categorie_id: null as number | null,
  })

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetch(`${API_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data.data))
      .catch((err) => console.error("Failed to fetch categories:", err))
  }, [API_URL])

  // ملء البيانات إذا كان تعديل
  useEffect(() => {
    if (group) {
      setFormData({
        name_group: group.name_group,
        description_group: group.description_group,
        categorie_id: group.categorie_id,
      })
    } else {
      setFormData({
        name_group: "",
        description_group: "",
        categorie_id: null,
      })
    }
  }, [group, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = new FormData()
    data.append("name_group", formData.name_group)
    data.append("description_group", formData.description_group)
    if (formData.categorie_id !== null) {
      data.append("categorie_id", formData.categorie_id.toString())
    }
    onSave(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{group ? "Edit Group" : "Add New Group"}</DialogTitle>
          <DialogDescription>
            {group
              ? "Update the group information below."
              : "Create a new group for organizing products."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                value={formData.name_group}
                onChange={(e) => setFormData({ ...formData, name_group: e.target.value })}
                placeholder="Enter group name"
                required
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description_group}
                onChange={(e) => setFormData({ ...formData, description_group: e.target.value })}
                placeholder="Enter group description"
                rows={3}
                required
              />
            </div>

            {/* Category Select */}
            <div className="grid gap-2">
              <Label htmlFor="categorie_id">Category</Label>
              <Select
                value={formData.categorie_id?.toString() || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, categorie_id: parseInt(value) })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id_categorie} value={cat.id_categorie.toString()}>
                      {cat.name_categorie}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{group ? "Update Group" : "Create Group"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
