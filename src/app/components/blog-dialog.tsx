"use client"

import type React from "react"

import { useState, useEffect,useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Blog {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  image_blog:string
  publishDate: string
  status: string
  category: string

}

interface BlogDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  blog?: Blog | null
  onSave: (blogData: Partial<Blog>) => void
}

export function BlogDialog({ open, onOpenChange, blog, onSave }: BlogDialogProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
  image: null as File | null,
    category: "",
    status: "draft",
  })

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content || "",
        author: blog.author,
       image: null,
        category: blog.category,
        status: blog.status,
      })
      setPreviewImage(blog.image_blog || null)
    } else {
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        author: "",
        image: null,
        category: "",
        status: "draft",
      })
      setPreviewImage(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }

  }, [blog, open])
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
    data.append("title", formData.title)
    data.append("excerpt", formData.excerpt)
        data.append("content", formData.content)
    data.append("author", formData.author)
       data.append("category", formData.category)
    data.append("status", formData.status)
    if (formData.image) data.append("image", formData.image)
    onSave(data)

  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{blog ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter blog title..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tutorial">Tutorial</SelectItem>
                  <SelectItem value="Guide">Guide</SelectItem>
                  <SelectItem value="Analytics">Analytics</SelectItem>
                  <SelectItem value="News">News</SelectItem>
                  <SelectItem value="Tips">Tips</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Enter blog excerpt..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter blog content..."
              rows={10}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Enter author name..."
                required
              />
            </div>

          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
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

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{blog ? "Update Blog Post" : "Create Blog Post"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
