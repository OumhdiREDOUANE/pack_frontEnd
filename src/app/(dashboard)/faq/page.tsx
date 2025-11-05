"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  HelpCircle,
} from "lucide-react"
import { FAQDialog } from "@/components/faq-dialog"
import { DeleteFAQDialog } from "@/components/delete-faq-dialog"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  is_published: boolean
  views: number
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [openItems, setOpenItems] = useState<string[]>([])
  const [faqDialogOpen, setFaqDialogOpen] = useState(false)
  const [deleteFaqDialogOpen, setDeleteFaqDialogOpen] = useState(false)
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

  const fetchFaqs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/FaqDashboard`)
      if (!res.ok) throw new Error("Failed to fetch FAQs")
      const data = await res.json()
      setFaqs(data)
      setError(false)
    } catch (err) {
      setError(true)
      throw new Error("Erreur lors du chargement des commandes");
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchFaqs()
  }, [])

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const categories = [...new Set(faqs.map((f) => f.category))]

  const handleAddFaq = () => {
    setSelectedFaq(null)
    setFaqDialogOpen(true)
  }

  const handleEditFaq = (faq: FAQ) => {
    setSelectedFaq(faq)
    setFaqDialogOpen(true)
  }

  const handleDeleteFaq = (faq: FAQ) => {
    setSelectedFaq(faq)
    setDeleteFaqDialogOpen(true)
  }

  const handleSaveFaq = async (faqData: Partial<FAQ>) => {
    try {
      if (selectedFaq) {
        const res = await fetch(`${API_BASE_URL}/api/FaqDashboard/${selectedFaq.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(faqData),
        })
        const updatedFaq = await res.json()
        setFaqs(faqs.map((f) => (f.id === updatedFaq.id ? updatedFaq : f)))
      } else {
        const res = await fetch(`${API_BASE_URL}/api/FaqDashboard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(faqData),
        })
        const newFaq = await res.json()
        setFaqs([...faqs, newFaq])
      }
    } catch (err) {
          throw new Error("Erreur lors du chargement des commandes");
    } finally {
      setFaqDialogOpen(false)
      setSelectedFaq(null)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      if (selectedFaq) {
        await fetch(`${API_BASE_URL}/api/FaqDashboard/${selectedFaq.id}`, {
          method: "DELETE",
        })
        setFaqs(faqs.filter((f) => f.id !== selectedFaq.id))
      }
    } catch (err) {
          throw new Error("Erreur lors du chargement des commandes");
    } finally {
      setDeleteFaqDialogOpen(false)
      setSelectedFaq(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">FAQ Management</h1>
          <Button onClick={handleAddFaq}>
            <Plus className="h-4 w-4 mr-2" /> Add FAQ
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Browse FAQs by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80"
                  onClick={() => setSearchTerm(category)}
                >
                  {category} ({faqs.filter((f) => f.category === category).length})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loader / Error / Empty / FAQ List */}
        {loading ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">Loading FAQs...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-red-500">Error fetching FAQs. Please try again later.</p>
            </CardContent>
          </Card>
        ) : filteredFAQs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No FAQs found matching your search.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <Card key={faq.id}>
                <Collapsible
                  open={openItems.includes(faq.id)}
                  onOpenChange={() => toggleItem(faq.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {openItems.includes(faq.id) ? (
                            <ChevronDown className="h-5 w-5 mt-0.5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-5 w-5 mt-0.5 text-muted-foreground" />
                          )}
                          <div className="flex-1">
                            <CardTitle className="text-left">{faq.question}</CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">{faq.category}</Badge>
                              <Badge variant={faq.is_published ? "default" : "secondary"}>
                                {faq.is_published ? "Published" : "Draft"}
                              </Badge>
                              <span className="text-sm text-muted-foreground">{faq.views} views</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditFaq(faq)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteFaq(faq)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 pl-8">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <FAQDialog
        open={faqDialogOpen}
        onOpenChange={setFaqDialogOpen}
        faq={selectedFaq}
        onSave={handleSaveFaq}
      />
      <DeleteFAQDialog
        open={deleteFaqDialogOpen}
        onOpenChange={setDeleteFaqDialogOpen}
        faq={selectedFaq}
        onConfirm={handleConfirmDelete}
      />
    </DashboardLayout>
  )
}
