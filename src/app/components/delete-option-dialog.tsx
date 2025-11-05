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

interface Option {
  id_option: string
  name_option: string
  image_option: string
  proprieter_id: string
}

interface DeleteOptionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  option: Option | null
  onConfirm: () => void
}

export function DeleteOptionDialog({ open, onOpenChange, option, onConfirm }: DeleteOptionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Option</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the option "{option?.name_option}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete Option
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
