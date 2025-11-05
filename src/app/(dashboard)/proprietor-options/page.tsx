"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import { OptionDashboardTable } from "@/components/proprietor-options-table"
import { ProprietorOptionDialog } from "@/components/proprietor-option-dialog"
import { DeleteProprietorOptionDialog } from "@/components/delete-proprietor-option-dialog"

interface OptionType {
  id_option:number
  name_option: string
  image_option: string
  description_option?: string
  count_proprieter: number
  prix?: number
}

interface Proprietor {
  id_proprieter: string
  name_proprieter: string
}

interface Product {
  id_product: string
  name_product: string
}

export default function ProprietorOptionsPage() {
  const [options, setOptions] = useState<OptionType[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [optionDialogOpen, setOptionDialogOpen] = useState(false)
  const [deleteOptionDialogOpen, setDeleteOptionDialogOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null)

  const [proprietors, setProprietors] = useState<Proprietor[]>([])
  const [products, setProducts] = useState<Product[]>([])
 const [loading, setLoading] = useState(true)     // 👈 حالة التحميل
  const [error, setError] = useState<string|null>(null)
  const [filterProprietor, setFilterProprietor] = useState("all")
  const [filterProduct, setFilterProduct] = useState("all")
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

  // Fetch options from Laravel API
  const fetchOptions = async () => {
    try {
       setLoading(true)          // ⬅️ ابدأ التحميل
      setError(null)
      let url = `${API_URL}/api/optionDashboard?proprieter_id=${filterProprietor}&product_id=${filterProduct}`
      const res = await fetch(url)
      const data = await res.json()
      setOptions(data)
    } catch (err:any) {
      setError(err.message)
           throw new Error("Erreur lors du chargement des commandes");

    } finally {
      setLoading(false)         // ⬅️ انتهى التحميل
    }
  }

  // Fetch proprietors and products for dropdowns
  const fetchFiltersData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/proprieterDashboard`)
    const data = await res.json()

    setProprietors(data.proprieters)
    setProducts(data.products)
    } catch (error) {
           throw new Error("Erreur lors du chargement des commandes");
    }
  }

  useEffect(() => {
    fetchFiltersData()
  }, [])

  useEffect(() => {
    fetchOptions()
  }, [filterProprietor, filterProduct])

  const filteredOptions = options.filter(
    (option) =>
      option.name_option.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (option.description_option?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  )

  const handleAddOption = () => {
    setSelectedOption(null)
    setOptionDialogOpen(true)
  }

  const handleEditOption = (option: OptionType) => {
    setSelectedOption(option)
    setOptionDialogOpen(true)
  }

  const handleDeleteOption = (option: OptionType) => {
    setSelectedOption(option)
    setDeleteOptionDialogOpen(true)
  }

  const handleSaveOption = async (optionData: any) => {
        if (selectedOption) optionData.append("_method", "PUT");
   try {
    const url = selectedOption
      ? `${API_URL}/api/optionDashboard/${selectedOption.id_option}`
      : `${API_URL}/api/optionDashboard`;

    const res = await fetch(url, {
      method: "POST",
      body: optionData,
    });

      if (!res.ok) throw new Error("Failed to save option")
      fetchOptions()
      setOptionDialogOpen(false)
      setSelectedOption(null)
    } catch (error) {
          throw new Error("Erreur lors du chargement des commandes");
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedOption) return
    try {
      await fetch(`${API_URL}/api/optionDashboard/${selectedOption.id_option}`, { method: "DELETE" })
      fetchOptions()
      setDeleteOptionDialogOpen(false)
      setSelectedOption(null)
    } catch (error) {
          throw new Error("Erreur lors du chargement des commandes");
    }
  }

  return (
    <DashboardLayout>
      <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Proprietor Options</h1>
          <Button onClick={handleAddOption}>
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </div>

        {/* Filters */}
        <div className="flex space-x-2">
         <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search options by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              </div>
          <Select value={filterProprietor} onValueChange={setFilterProprietor}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Proprietor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Proprietors</SelectItem>
              {proprietors.map((p) => (
                <SelectItem key={p.id_proprieter} value={p.id_proprieter}>{p.name_proprieter}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterProduct} onValueChange={setFilterProduct}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {products.map((p) => (
                <SelectItem key={p.id_product} value={p.id_product}>{p.name_product}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        

        {/* Search */}
        
 
        </div>
        
        {/* Options Table */}
        <OptionDashboardTable options={filteredOptions} onEdit={handleEditOption}  onDelete={handleDeleteOption} loading={loading}     // 👈 مرّر القيمة الحقيقية
          error={error} />
      </div>
</Card>
      <ProprietorOptionDialog
        open={optionDialogOpen}
        onOpenChange={setOptionDialogOpen}
        option={selectedOption}
        proprieters={proprietors}
        products ={products}
        onSave={handleSaveOption}
      />

      <DeleteProprietorOptionDialog
        open={deleteOptionDialogOpen}
        onOpenChange={setDeleteOptionDialogOpen}
        option={selectedOption}
        onConfirm={handleConfirmDelete}
      />
    </DashboardLayout>
  )
}
