"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Building } from "lucide-react"

interface Proprietor {
  id_proprieter: string
  name_proprieter: string
  description_proprieter?: string
  product_count: number
  option_count: number
  total_options_owned: number
  filtered_by_product?: number
}

interface DeleteProprietorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  proprietor?: Proprietor | null
  onConfirm: () => void
}

export function DeleteProprietorDialog({ open, onOpenChange, proprietor, onConfirm }: DeleteProprietorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle>Delete Proprietor</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this proprietor? This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {proprietor && (
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center space-x-3">
              <Building className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">{proprietor.name_proprieter}</p>
                <p className="text-sm text-muted-foreground">{proprietor.description_proprieter}</p>
                <p className="text-xs text-muted-foreground">
                  {proprietor.product_count} products  
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete Proprietor
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
