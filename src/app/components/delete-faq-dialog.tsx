"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  isPublished: boolean
  views: number
}

interface DeleteFAQDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  faq?: FAQ | null
  onConfirm: () => void
}

export function DeleteFAQDialog({ open, onOpenChange, faq, onConfirm }: DeleteFAQDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle>Delete FAQ</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this FAQ? This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {faq && (
          <div className="rounded-lg bg-muted p-4">
            <p className="font-medium text-sm">{faq.question}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Category: {faq.category} • {faq.views} views
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete FAQ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
