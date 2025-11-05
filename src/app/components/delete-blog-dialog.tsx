"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Blog {
  id: string
  title: string
  excerpt: string
  author: string
  authorAvatar: string
  publishDate: string
  status: string
  category: string
  views: number
}

interface DeleteBlogDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  blog: Blog | null
  onConfirm: () => void
}

export function DeleteBlogDialog({ open, onOpenChange, blog, onConfirm }: DeleteBlogDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Blog Post</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the blog post "{blog?.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete Blog Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
