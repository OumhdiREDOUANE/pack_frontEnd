"use client"

import { useState, useEffect, useRef } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"

interface Category {
  id_categorie: number
  name_categorie: string
  groups?: { id_group: number; name_group: string }[]
}

interface Product {
  id_product: number
  name_product: string
  description_product: string
  categorie_id: number
  categorie?: string
  group_id?: number | null
  group?: string
  images: { id_image: number; url_image: string }[]
}

interface ProductDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: any) => void
}

export function ProductDialog({ product, open, onOpenChange, onSave }: ProductDialogProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
  const [formData, setFormData] = useState({
    name_product: "",
    description_product: "",
    categorie_id: "",
    group_id: "", // keep as string for select
    newImages: [] as File[],
    existingImages: [] as string[],
  })
  const [categories, setCategories] = useState<Category[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isAddMode = !product

  // Fetch categories on mount
  useEffect(() => {
    fetch(`${API_URL}/api/categories`)
      .then(res => res.json())
      .then(data => setCategories(data.data))
  }, [])

  // Set form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name_product: product.name_product,
        description_product: product.description_product,
        categorie_id: product.categorie_id?.toString() ?? "",
        group_id: product.group_id !== null ? product.group_id.toString() : "",
        newImages: [],
        existingImages: product.images.map(img => img.url_image),
      })
    } else {
      setFormData({
        name_product: "",
        description_product: "",
        categorie_id: "",
        group_id: "",
        newImages: [],
        existingImages: [],
      })
    }
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [product, open])

  const selectedCategory = categories.find(cat => cat.id_categorie.toString() === formData.categorie_id)
  const groups = selectedCategory?.groups ?? []

  const handleAddImage = (files: FileList | null) => {
    if (!files) return
    const newFiles = Array.from(files)
    setFormData({ ...formData, newImages: [...formData.newImages, ...newFiles] })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const removeNewImage = (index: number) => {
    const updated = [...formData.newImages]
    updated.splice(index, 1)
    setFormData({ ...formData, newImages: updated })
  }

  const removeExistingImage = (index: number) => {
    const updated = [...formData.existingImages]
    updated.splice(index, 1)
    setFormData({ ...formData, existingImages: updated })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.categorie_id) {
      alert("Please select a category")
      return
    }

    if (isAddMode && formData.newImages.length === 0) {
      alert("Please add at least one image")
      return
    }

    const submitData = {
      ...formData,
      categorie_id: parseInt(formData.categorie_id),
  
      group_id: formData.group_id === "" ? null : parseInt(formData.group_id),
    }

    onSave(submitData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isAddMode ? "Add New Product" : "Edit Product"}</DialogTitle>
          <DialogDescription>
            {isAddMode ? "Fill in the details to create a new product." : "Update product information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Product Name */}
            <div className="grid gap-2">
              <Label htmlFor="name_product">Product Name</Label>
              <Input
                id="name_product"
                value={formData.name_product}
                onChange={e => setFormData({ ...formData, name_product: e.target.value })}
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description_product">Description</Label>
              <Textarea
                id="description_product"
                value={formData.description_product}
                onChange={e => setFormData({ ...formData, description_product: e.target.value })}
                placeholder="Enter product description"
                rows={3}
                required
              />
            </div>

            {/* Category & Group */}
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Label htmlFor="categorie_id">Category</Label>
                <Select
                  value={formData.categorie_id}
                  onValueChange={value => setFormData({ ...formData, categorie_id: value, group_id: "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id_categorie} value={cat.id_categorie.toString()}>
                        {cat.name_categorie}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" value={formData.categorie_id} required />
              </div>

              <div className="flex-1">
                <Label htmlFor="group_id">Group</Label>
                <Select
                 value={formData.group_id || "none"}
                  disabled={!formData.categorie_id || groups.length === 0}
                  onValueChange={value =>     setFormData({ ...formData, group_id: value === "none" ? "" : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select group (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {groups.map(grp => (
                      <SelectItem key={grp.id_group} value={grp.id_group.toString()}>
                        {grp.name_group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Images */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Product Images {isAddMode ? "(required)" : "(optional)"}</Label>
                <Button type="button" variant="outline" size="sm">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <Plus className="h-4 w-4" /> Add Image
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="absolute w-0 h-0 opacity-0"
                      onChange={e => handleAddImage(e.target.files)}
                    />
                  </label>
                </Button>
              </div>

              <div className="flex flex-wrap gap-3 mt-2">
                {formData.existingImages.map((url, index) => (
                  <div key={`existing-${index}`} className="relative">
                    <img src={url} alt={`preview ${index}`} className="h-16 w-16 rounded object-cover border" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-5 w-5 p-0"
                      onClick={() => removeExistingImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {formData.newImages.map((file, index) => (
                  <div key={`new-${index}`} className="relative">
                    <img src={URL.createObjectURL(file)} alt={`preview ${index}`} className="h-16 w-16 rounded object-cover border" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-5 w-5 p-0"
                      onClick={() => removeNewImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isAddMode ? "Create" : "Update"} Product</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
