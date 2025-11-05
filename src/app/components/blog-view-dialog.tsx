"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface BlogViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  blog: { title: string; content: string } | null
}

export function BlogViewDialog({ open, onOpenChange, blog }: BlogViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{blog?.title}</DialogTitle>
          <DialogDescription>Full content of the blog post:</DialogDescription>
        </DialogHeader>
        <div className="mt-4 whitespace-pre-line">{blog?.content}</div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
