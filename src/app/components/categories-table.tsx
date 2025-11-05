"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Plus, Search, Edit, Trash2 } from "lucide-react"
import { CategoryDialog } from "@/components/category-dialog"
import { DeleteCategoryDialog } from "@/components/delete-category-dialog"

interface Category {
  id_categorie: string
  name_categorie: string
  description_categorie: string
  url: string
  products_count: number
}

export function CategoriesTable() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  // تغيير الرابط عند النشر
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

  // جلب البيانات
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/categoryDashboard`)
      if (!res.ok) throw new Error("Failed to fetch categories")
      const data = await res.json()
      setCategories(data.data || [])
    } catch (err: any) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  // فلترة البحث
  const filteredCategories = categories.filter(
    (cat) =>
      cat.name_categorie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description_categorie.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // فتح نافذة إضافة
  const handleAddCategory = () => {
    setSelectedCategory(null)
    setIsDialogOpen(true)
  }

  // فتح نافذة تعديل
  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    setIsDialogOpen(true)
  }

  // فتح نافذة حذف
  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category)
    setIsDeleteDialogOpen(true)
  }

  // حفظ التعديل أو الإضافة
  const handleSaveCategory = async (formData: FormData) => {
    if (selectedCategory) formData.append("_method", "PUT");

  try {
    const url = selectedCategory
      ? `${API_URL}/api/categoryDashboard/${selectedCategory.id_categorie}`
      : `${API_URL}/api/categoryDashboard`;

    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to save category")

    fetchCategories()
    setIsDialogOpen(false)
  } catch (err) {
     throw new Error("Erreur lors du chargement des commandes");
  }
}


  // تأكيد الحذف
  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        const res = await fetch(`${API_URL}/api/categoryDashboard/${categoryToDelete.id_categorie}`, {
          method: "DELETE",
        })
        if (!res.ok) throw new Error("Failed to delete category")
        fetchCategories()
        setIsDeleteDialogOpen(false)
        setCategoryToDelete(null)
      } catch (err) {
             throw new Error("Erreur lors du chargement des commandes");
      }
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Manage product categories and their assignments</CardDescription>
          </div>
          <Button onClick={handleAddCategory}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </CardHeader>

        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            {loading ? (
              <p className="p-4 text-center text-muted-foreground">Loading categories...</p>
            ) : error ? (
              <p className="p-4 text-center text-red-500">error</p>
            ) : filteredCategories.length === 0 ? (
              <p className="p-4 text-center text-muted-foreground">No categories found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id_categorie}>
                      <TableCell className="font-medium flex gap-3 text-center ">
                        <img src={category.url} alt={category.name_categorie} className="h-16 w-16 rounded-md object-cover"  />
                      {category.name_categorie}</TableCell>
                      <TableCell className="text-muted-foreground ">{category.description_categorie}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          {category.products_count}
                        </div>
                      </TableCell>
                   <TableCell >
                    <div className="flex justify-center items-center gap-2 ">
                      <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category)}>
      <Edit className="h-4 w-4" />
    </Button>
    <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category)}>
      <Trash2 className="h-4 w-4 text-red-500" />
    </Button>
                    </div>

    
</TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      <CategoryDialog
        category={selectedCategory}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveCategory}
      />

      <DeleteCategoryDialog
        category={categoryToDelete}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </>
  )
}
