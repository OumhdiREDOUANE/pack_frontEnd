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
import { Plus, Search, Edit, Trash2, Eye, Calendar } from "lucide-react"
import { BlogDialog } from "@/components/blog-dialog"
import { DeleteBlogDialog } from "@/components/delete-blog-dialog"
import { BlogViewDialog } from "@/components/blog-view-dialog"

export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [blogs, setBlogs] = useState<any[]>([])
  const [blogDialogOpen, setBlogDialogOpen] = useState(false)
  const [deleteBlogDialogOpen, setDeleteBlogDialogOpen] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState<any | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [viewBlog, setViewBlog] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/BlogDashboard`)
      if (!res.ok) throw new Error("Failed to fetch blogs")
      const data = await res.json()
      return data
    } catch (err) {
      setError(true)
      throw new Error("Erreur lors du chargement des commandes");
   
    }
  }
const getBlogs = async () => {
      setLoading(true)
      setError(false)
      const data = await fetchBlogs()
      setBlogs(data)
      setLoading(false)
    }
  useEffect(() => {
    

    getBlogs()
  }, [])

  // Helper for status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500"
      case "draft":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  // Handlers
  const handleAddBlog = () => {
    setSelectedBlog(null)
    setBlogDialogOpen(true)
  }

  const handleEditBlog = (blog: any) => {
    setSelectedBlog(blog)
    setBlogDialogOpen(true)
  }

  const handleDeleteBlog = (blog: any) => {
    setSelectedBlog(blog)
    setDeleteBlogDialogOpen(true)
  }

  const handleViewBlog = (blog: any) => {
    setViewBlog(blog)
    setViewDialogOpen(true)
  }

  const handleSaveBlog = async (blogData: any) => {
    
      if (selectedBlog) blogData.append("_method", "PUT");

  try {
    const url = selectedBlog
      ? `${API_BASE_URL}/api/BlogDashboard/${selectedBlog.id}`
      : `${API_BASE_URL}/api/BlogDashboard`;

    const res = await fetch(url, {
      method: "POST",
      body: blogData,
    });

    if (!res.ok) throw new Error("Failed to save Blog")
      setBlogDialogOpen(false)
       getBlogs()
    } catch (err) {
           throw new Error("Erreur lors du chargement des commandes");
    }
  }

  const handleConfirmDelete = async () => {
    try {
      if (selectedBlog) {
        await fetch(`${API_BASE_URL}/api/BlogDashboard/${selectedBlog.id}`, { method: "DELETE" })
      }
      setDeleteBlogDialogOpen(false)
      fetchBlogs()
    } catch (err) {
          throw new Error("Erreur lors du chargement des commandes");
    }
  }

  // Filter blogs based on search
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <Button onClick={handleAddBlog}>
            <Plus className="h-4 w-4 mr-2" />
            New Blog Post
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search blogs by title or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loader / Error / Empty / Blog Cards */}
        {loading ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">Loading blogs...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-red-500">Error fetching blogs. Please try again later.</p>
            </CardContent>
          </Card>
        ) : filteredBlogs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No blog posts found matching your search.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <Card key={blog.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary">{blog.category}</Badge>
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(blog.status)} text-white border-0`}
                    >
                      {blog.status}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{blog.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{blog.author}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(blog.publishDate).toLocaleDateString()}
                      </div>
                      
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleViewBlog(blog)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleEditBlog(blog)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700 bg-transparent"
                        onClick={() => handleDeleteBlog(blog)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <BlogViewDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} blog={viewBlog} />
      <BlogDialog
        open={blogDialogOpen}
        onOpenChange={setBlogDialogOpen}
        blog={selectedBlog}
        onSave={handleSaveBlog}
      />
      <DeleteBlogDialog
        open={deleteBlogDialogOpen}
        onOpenChange={setDeleteBlogDialogOpen}
        blog={selectedBlog}
        onConfirm={handleConfirmDelete}
      />
    </DashboardLayout>
  )
}
