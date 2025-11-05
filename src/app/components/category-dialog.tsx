"use client"

import React, { useState, useEffect, useRef } from "react"
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

interface Category {
  id_categorie?: number
  name_categorie: string
  description_categorie: string
  url?: string
}

interface CategoryDialogProps {
  category: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: FormData) => void
}

export function CategoryDialog({ category, open, onOpenChange, onSave }: CategoryDialogProps) {
  const [formData, setFormData] = useState({
    name_categorie: "",
    description_categorie: "",
    image: null as File | null,
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // عند فتح الـ Dialog أو تعديل فئة، نملا الفورم بالبيانات الحالية
  useEffect(() => {
    if (category) {
      setFormData({
        name_categorie: category.name_categorie,
        description_categorie: category.description_categorie,
        image: null,
      })
      setPreviewImage(category.url || null)
    } else {
      setFormData({
        name_categorie: "",
        description_categorie: "",
        image: null,
      })
      setPreviewImage(null)
    }
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [category, open])

  // عند اختيار صورة جديدة
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData({ ...formData, image: file })

      // عرض preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = new FormData()
    data.append("name_categorie", formData.name_categorie)
    data.append("description_categorie", formData.description_categorie)
    if (formData.image) data.append("image", formData.image)
    onSave(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Add New Category"}</DialogTitle>
          <DialogDescription>
            {category ? "Update the category information below." : "Create a new category for organizing products."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={formData.name_categorie}
                onChange={(e) => setFormData({ ...formData, name_categorie: e.target.value })}
                placeholder="Enter category name"
                required
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description_categorie}
                onChange={(e) => setFormData({ ...formData, description_categorie: e.target.value })}
                placeholder="Enter category description"
                rows={3}
                required
              />
            </div>

            {/* Preview Image */}
            

            {/* Upload Image */}
            <div className="grid gap-2">
              <Label>Upload Image</Label>
              <Input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
            </div>
            {previewImage && (
              <div className="grid gap-2">
                
                <div className="relative w-20 h-20">
                  <img src={previewImage} alt="preview" className="w-20 h-20 rounded object-cover border" />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{category ? "Update Category" : "Create Category"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
