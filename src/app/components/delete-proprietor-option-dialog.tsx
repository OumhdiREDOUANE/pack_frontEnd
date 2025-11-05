"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Sliders } from "lucide-react"

interface ProprietorOption {
  id: string
  name_option: string
  description_option: string
  type: string
  value: string
  category: string
  isActive: boolean
  applicableProprietors: string[]
  createdDate: string
}

interface DeleteProprietorOptionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  option?: ProprietorOption | null
  onConfirm: () => void
}

export function DeleteProprietorOptionDialog({
  open,
  onOpenChange,
  option,
  onConfirm,
}: DeleteProprietorOptionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle>Delete Option</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this option? This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {option && (
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center space-x-3">
              <Sliders className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">{option.name_option}</p>
                <p className="text-sm text-muted-foreground">{option.description_option}</p>
                
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete Option
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
