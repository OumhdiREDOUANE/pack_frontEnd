"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductDialog } from "@/components/product-dialog"
import { DeleteProductDialog } from "@/components/delete-product-dialog"
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Product {
  id_product: number
  name_product: string
  description_product: string
  categorie: string
  categorie_id: number
  group_id?: number
  group?:string
  images: { id_image: number; url_image: string }[]
}

export function ProductsTable() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/productDashboard`)
      if (!res.ok) throw new Error("Failed to fetch products")
      const data = await res.json()
      setProducts(data.data)
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const categories = Array.from(new Set(products.map((product) => product.categorie)))

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name_product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description_product.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.categorie === categoryFilter
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsProductDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsProductDialogOpen(true)
  }

  const handleSaveProduct = async (formDataData: any) => {
    const formDataToSend = new FormData()
    formDataToSend.append("name_product", formDataData.name_product)
    formDataToSend.append("description_product", formDataData.description_product)
    formDataToSend.append("categorie_id", formDataData.categorie_id)
if (formDataData.group_id !== null) {
  formDataToSend.append("group_id", formDataData.group_id)
} else {
  formDataToSend.append("group_id", "") // or skip it depending on backend
}

    formDataData.existingImages.forEach((url: string) => {
      formDataToSend.append("existing_images[]", url)
    })
    formDataData.newImages.forEach((file: File) => {
      formDataToSend.append("images[]", file)
    })

    try {
      if (selectedProduct) {
        formDataToSend.append("_method", "PUT")
        await fetch(`${API_URL}/api/productDashboard/${selectedProduct.id_product}`, {
          method: "POST",
          body: formDataToSend,
        })
      } else {
        await fetch(`${API_URL}/api/productDashboard`, {
          method: "POST",
          body: formDataToSend,
        })
      }
      
      await fetchProducts()
      setIsProductDialogOpen(false)
    } catch (err) {
           throw new Error("Erreur lors du chargement des commandes");
    }
  }

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!productToDelete) return
    try {
      await fetch(`${API_URL}/api/productDashboard/${productToDelete.id_product}`, {
        method: "DELETE",
      })
      setProducts(products.filter((p) => p.id_product !== productToDelete.id_product))
      setIsDeleteDialogOpen(false)
      setProductToDelete(null)
    } catch (err) {     throw new Error("Erreur lors du chargement des commandes");
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value)
    setCurrentPage(1)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
          <Button onClick={handleAddProduct}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
        <div className="flex gap-4 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {loading && <div className="text-center">Loading products...</div>}
        {error && <div className="text-red-500">error</div>}

        {!loading && !error && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name Product</TableHead>
                  

                  <TableHead>Category</TableHead>
                  <TableHead>Group of Categroy</TableHead>

                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
             <TableBody>
  {paginatedProducts.length > 0 ? (
    paginatedProducts.map((product) => (
      <TableRow key={product.id_product}>
        <TableCell>
          <div className="flex items-center gap-3">
            {product.images?.map((img) => (
              <img
                key={img.id_image}
                src={img.url_image}
                alt={product.name_product}
                className="h-10 w-10 rounded-md object-cover"
              />
            ))}
            <div>
              <div className="font-medium">{product.name_product}</div>
              <div className="text-sm text-muted-foreground">{product.description_product}</div>
            </div>
          </div>
        </TableCell>
        <TableCell>{product.categorie}</TableCell>
        <TableCell>{product.group??"not belongs any group"}</TableCell>

        <TableCell className="text-right">
          <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
        No products found.
      </TableCell>
    </TableRow>
  )}
</TableBody>

            </Table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <ProductDialog
        product={selectedProduct}
        open={isProductDialogOpen}
        onOpenChange={setIsProductDialogOpen}
        onSave={handleSaveProduct}
      />
      <DeleteProductDialog
        product={productToDelete}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </Card>
  )
}
